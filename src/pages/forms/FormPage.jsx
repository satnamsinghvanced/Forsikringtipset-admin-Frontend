import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const FormCreateEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if exists → edit mode

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    formTitle: "",
    formDescription: "",
    price: "",
  });

  // Load form in edit mode
  useEffect(() => {
    if (!isEdit) return;

    const loadForm = async () => {
      try {
        const { data } = await api.get(`/form-select/${id}`);
        setFormData({
          formTitle: data.data?.formTitle || "",
          formDescription: data.data?.formDescription || "",
          price: data.data?.price || "",
        });
      } catch (err) {
        toast.error("Failed to load form");
      }
    };

    loadForm();
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!formData.formTitle.trim()) {
      return toast.error("Form title is required");
    }

    try {
      setLoading(true);

      if (isEdit) {
        // UPDATE FORM
        await api.put(`/form-select/${id}`, formData);
        toast.success("Form updated successfully!");
      } else {
        // CREATE FORM
        await api.post("/form-select", {
          formId: formData.formTitle.toLowerCase().replace(/\s+/g, "-"),
          ...formData,
        });
        toast.success("Form created successfully!");
      }

      navigate("/forms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const headerButtons = [
    {
      value: "Back",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate("/forms"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Form" : "Create Form"}
        description={
          isEdit
            ? "Update form title and description."
            : "Add a new dynamic form."
        }
        buttonsList={headerButtons}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Form Title
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              value={formData.formTitle}
              onChange={(e) =>
                setFormData({ ...formData, formTitle: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              rows="3"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              value={formData.formDescription}
              onChange={(e) =>
                setFormData({ ...formData, formDescription: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Price
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <button
            className="rounded-lg bg-primary py-2 text-white hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isEdit ? "Update Form" : "Create Form"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCreateEditPage;
