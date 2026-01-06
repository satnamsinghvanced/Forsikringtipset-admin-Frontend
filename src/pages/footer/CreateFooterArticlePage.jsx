// src/pages/footer/CreateFooterArticlePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios"; // your axios instance
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { toast } from "react-toastify";
import { fetchFooter, updateFooter } from "../../store/slices/footerSlice";

const CreateFooterArticlePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { footer } = useSelector((s) => s.footer || {});
  const [articles, setArticles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch articles list for dropdown
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/article?limit=200"); 
        setArticles(data.data || data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };
    load();
    if (!footer) dispatch(fetchFooter());
  }, [dispatch, footer]);

  const handleAddSelected = async () => {
    if (!selectedId) return toast.error("Choose an article");
    const article = articles.find((a) => a._id === selectedId || a.id === selectedId);
    if (!article) return toast.error("Article not found");

    const title = article.title || article.heading || "Untitled";
    const href = article.slug ? `/artikler/${article.categoryId.slug}/${article.slug}` : (article.href || `/artikler/${article._id}`);

    try {
      const working = { ...(footer || {}) };
      const arr = Array.isArray(working.articles) ? [...working.articles] : [];
      arr.push({ title, href });
      working.articles = arr;
      console.log(working)
      await dispatch(updateFooter({body : working})).unwrap();
      toast.success("Article added to footer");
      dispatch(fetchFooter());
      navigate("/footer");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Article to Footer" description="Select an article to add to the footer" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <label className="block text-sm">Select Article</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
            <option value="">-- Select article --</option>
            {loading ? <option>Loading...</option> : articles.map((a) => (
              <option key={a._id || a.id} value={a._id || a.id}>
                {a.title || a.heading}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 mt-6">
            <button className="rounded-full border px-4 py-2" onClick={() => navigate("/footer")}>Cancel</button>
            <button className="rounded-full bg-primary px-4 py-2 text-white" onClick={handleAddSelected}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFooterArticlePage;
