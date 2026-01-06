import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { toast } from "react-toastify";
import { fetchFooter, updateFooter } from "../../store/slices/footerSlice";

const ENDPOINTS = {
  articles: "/article?limit=200",
  places: "/places?limit=200",
  companies: "/companies?limit=200",
};

const CreateFooterSelectPage = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { footer } = useSelector((s) => s.footer || {});
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const url = ENDPOINTS[tab];
        if (!url) return toast.error("Invalid Tab Type");

        const { data } = await api.get(url);
        setList(data.data || data || []);
      } catch (err) {
        toast.error("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    load();
    if (!footer) dispatch(fetchFooter());
  }, [tab, dispatch, footer]);

  const handleAddSelected = async () => {
    if (!selectedId) return toast.error("Please choose one");

    const item = list.find((i) => i._id === selectedId || i.id === selectedId);
    if (!item) return toast.error("Item not found");

    let title = "";
    let href = "";

    if (tab === "articles") {
      title = item.title || item.heading || "Untitled";
      href = item.slug ? `/artikler/${item.categoryId.slug}/${item.slug}` : `/artikler/${item._id}`;
    } else if (tab === "places") {
      title = item.name || item.title || "Place";
      href = `/bedrifter/${item.slug || item._id}`;
    } else if (tab === "companies") {
      title = item.name || item.companyName || "Company";
      href = `/bedrifter/${item.slug || item._id}`;
    }

    try {
      const working = { ...(footer || {}) };
      const arr = Array.isArray(working[tab]) ? [...working[tab]] : [];
      arr.push({ title, href });
      working[tab] = arr;

      await dispatch(updateFooter({body: working})).unwrap();
      toast.success(`${title} added to footer`);

      dispatch(fetchFooter());
      navigate("/footer");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Add ${tab} to Footer`}
        description={`Select a ${tab.slice(0, -1)} to add`}
      />

      <div className="rounded-2xl border bg-white p-6">
        <label className="block text-sm mb-3">Select {tab}</label>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">-- Select --</option>
          {loading ? (
            <option>Loading...</option>
          ) : (
            list.map((i) => (
              <option key={i._id || i.id} value={i._id || i.id}>
                {i.name || i.title || i.heading ||i.companyName}
              </option>
            ))
          )}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="rounded-full border px-4 py-2"
            onClick={() => navigate("/footer")}
          >
            Cancel
          </button>

          <button
            className="rounded-full bg-primary px-4 py-2 text-white"
            onClick={handleAddSelected}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFooterSelectPage;
