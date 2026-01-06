import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPlus, LuListChecks } from "react-icons/lu";
import { toast } from "react-toastify";

import {
  getForms,
  createForm,
  updateForm,
  deleteForm,
} from "../../store/slices/formSelectSlice";

import PageHeader from "../../components/PageHeader";
import StepsBuilderForm from "./StepsBuilderForm";
import Pagination from "../../UI/pagination";
import { useNavigate } from "react-router";

const FormManagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { forms, loading } = useSelector((state) => state.formSelect);

  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = 1; // adjust if backend supports pagination

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const [selectedForm, setSelectedForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  useEffect(() => {
    dispatch(getForms());
  }, [dispatch]);

  // Reset fields
  const clearFields = () => {
    setFormTitle("");
    setFormDescription("");
    setEditId(null);
  };

  // Save Form (Create / Update)
  const handleSave = async () => {
    if (!formTitle.trim()) return toast.error("Form title is required!");

    const payload = {
      formId: formTitle.toLowerCase().replace(/\s+/g, "-"),
      formTitle,
      formDescription,
    };

    const action = editId
      ? updateForm({ id: editId, payload })
      : createForm(payload);

    const res = await dispatch(action);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(editId ? "Form updated!" : "Form created!");
      clearFields();
      dispatch(getForms());
    } else toast.error(res.payload || "Something went wrong");
  };

  const handleEdit = (form) => {
    setEditId(form._id);
    setFormTitle(form.formTitle);
    setFormDescription(form.formDescription);
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
  };

  const handleDeleteForm = async () => {
    if (!formToDelete) return;
    const res = await dispatch(deleteForm(formToDelete._id));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Form deleted!");
      dispatch(getForms());
    } else toast.error(res.payload);

    setShowDeleteModal(false);
    setFormToDelete(null);
  };

  const headerButtons = [
    {
      value: "Create Form",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate("/forms/create"),
    },
    {
      value: "Create Fixed Steps First and Final",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate("/admin/fixed-steps"),
    },
  ];

  // If steps mode active
  if (selectedForm) {
    return (
      <StepsBuilderForm
        form={selectedForm}
        onBack={() => setSelectedForm(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Form/Lead Manager"
        description="Create, edit, and manage multi-step forms."
        buttonsList={headerButtons}
      />

      {/* LIST ALL FORMS */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border border-slate-200">
          <p className="font-semibold text-slate-900 text-sm">Forms Overview</p>
          <p className="text-xs text-slate-500">
            {loading ? "Loading..." : `${forms.length} items`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500  ">
              <tr>
                <th className="px-6 py-3  text-left ">#</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded" />
                    </td>
                  </tr>
                ))
              ) : forms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-500">
                    No forms found
                  </td>
                </tr>
              ) : (
                forms.map((form, index) => (
                  <tr key={form._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {form.formTitle}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {form.formDescription || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {form.price || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <div className="relative group">
                          <button
                            className="p-2 border rounded-full text-slate-600 hover:text-black"
                            onClick={() => navigate(`/forms/${form._id}/edit`)}
                          >
                            <AiTwotoneEdit size={16} />
                          </button>
                          <span className="absolute left-1/2 -translate-x-1/2 -top-8 w-[77px]  hidden group-hover:block bg-slate-800 text-white text-xs  px-2 py-1 rounded shadow">
                            Edit Form
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            className="p-2 border rounded-full text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedForm(form)}
                          >
                            <LuListChecks size={16} />
                          </button>
                          <span className="absolute left-1/2 -translate-x-1/2 -top-8 w-[112px]  hidden group-hover:block bg-slate-800 text-white text-xs  px-2 py-1 rounded shadow">
                            View/Add Steps
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            className="p-2 border rounded-full text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteClick(form)}
                          >
                            <RiDeleteBin5Line size={16} />
                          </button>

                          <span className="absolute left-1/2 -translate-x-1/2 -top-8   hidden group-hover:block bg-slate-800 text-white text-xs  px-2 py-1 rounded shadow">
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — optional */}
        {forms.length > 10 && (
          <div className="border-t px-6 py-4">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <p className="font-semibold mb-6 text-center">Delete this form?</p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-full border"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-full bg-red-600 text-white"
                onClick={handleDeleteForm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormManagePage;
