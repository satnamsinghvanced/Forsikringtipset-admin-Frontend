/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  getSteps,
  createStep,
  updateStep,
  deleteStep,
} from "../../store/slices/stepSlice";

const FixedStepsBuilder = ({ onBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { steps = [], loading } = useSelector((state) => state.steps || {});

  const [form] = useState({
    _id: "fixed-steps",
    formTitle: "Fixed Steps (First & Final)",
    formDescription:
      "Manage the global first and final steps applied to all forms.",
  });

  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    dispatch(getSteps());
  }, [dispatch]);

  const openStepForm = (step = null) => {
    if (step) setCurrentStep({ ...step });
    else
      setCurrentStep({
        stepType: "first",
        stepTitle: "",
        stepDescription: "",
        stepOrder: (steps?.length || 0) + 1,
        fields: [
          {
            label: "",
            name: "",
            type: "text",
            placeholder: "",
            required: false,
            options: [],
          },
        ],
      });
  };

  // Field handlers
  const updateField = (index, key, value) => {
    const updatedFields = [...currentStep.fields];
    updatedFields[index][key] = value;
    if (
      !["select", "checkbox", "radio", "dropdown"].includes(
        updatedFields[index].type
      )
    )
      updatedFields[index].options = [];
    setCurrentStep({ ...currentStep, fields: updatedFields });
  };
  const addField = () =>
    setCurrentStep({
      ...currentStep,
      fields: [
        ...currentStep.fields,
        {
          label: "",
          name: "",
          type: "text",
          placeholder: "",
          required: false,
          options: [],
        },
      ],
    });
  const removeField = (index) =>
    setCurrentStep({
      ...currentStep,
      fields: currentStep.fields.filter((_, i) => i !== index),
    });
  const toggleRequired = (index) => {
    const updatedFields = [...currentStep.fields];
    updatedFields[index].required = !updatedFields[index].required;
    setCurrentStep({ ...currentStep, fields: updatedFields });
  };
  const addOption = (fi) => {
    const updated = [...currentStep.fields];
    updated[fi].options.push("");
    setCurrentStep({ ...currentStep, fields: updated });
  };
  const updateOption = (fi, oi, value) => {
    const updated = [...currentStep.fields];
    updated[fi].options[oi] = value;
    setCurrentStep({ ...currentStep, fields: updated });
  };
  const removeOption = (fi, oi) => {
    const updated = [...currentStep.fields];
    updated[fi].options.splice(oi, 1);
    setCurrentStep({ ...currentStep, fields: updated });
  };

  // Save / Delete step
  const handleSaveStep = async () => {
    if (!currentStep.stepTitle) return toast.error("Step Title is required!");
    try {
      for (let f of currentStep.fields)
        if (!f.label || !f.name)
          throw new Error("All fields must have label and name");

      const payload = {
        stepType: currentStep.stepType,
        stepTitle: currentStep.stepTitle,
        stepDescription: currentStep.stepDescription,
        stepOrder: currentStep._id ? currentStep.stepOrder : steps.length + 1,
        fields: currentStep.fields.map((f) => ({
          label: f.label,
          name: f.name,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder || "",
          options: f.options.map((opt) =>
            typeof opt === "string" ? opt : opt.value
          ),
        })),
      };

      let res;
      if (currentStep._id) {
        res = await dispatch(updateStep({ id: currentStep._id, payload }));
      } else {
        res = await dispatch(createStep(payload));
      }

      if (res.meta.requestStatus === "fulfilled") {
        toast.success(currentStep._id ? "Step updated!" : "Step added!");
        setCurrentStep(null);
        dispatch(getSteps()); // Refresh steps
      } else {
        toast.error(res.payload || "Failed to save step");
      }
    } catch (err) {
      toast.error(`Failed to save step. ${err.message}`);
    }
  };

  const handleDeleteStep = async (index) => {
    if (!window.confirm("Are you sure you want to delete this step?")) return;
    try {
      const stepId = steps[index]._id;
      const res = await dispatch(deleteStep(stepId));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Step deleted");
      } else {
        toast.error(res.payload || "Failed to delete step");
      }
    } catch (err) {
      toast.error("Failed to delete step");
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("/forms"); // or navigate(-1)
  };

  const headerButtons = [
    {
      value: "Back to forms",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: handleBack,
    },
    {
      value: "Add New Step",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-primary/80 hover:!border-primary",
      onClick: () => openStepForm(),
    },
  ];

  if (!form) return <div className="p-6">Steps not found.</div>;

  // -------------------
  // LIST VIEW
  // -------------------
  if (!currentStep) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={form.formTitle}
          description={form.formDescription}
          buttonsList={headerButtons}
        />

        {loading ? (
          <div className="text-center py-10">Loading steps...</div>
        ) : steps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No fixed steps added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div
                key={s._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h6>
                      {" "}
                      Step Type:{" "}
                      <span className="text-sm text-slate-600">
                        {s?.stepType || "N/A"}
                      </span>
                    </h6>

                    <h3 className="font-bold text-lg">
                      {i + 1}. {s.stepTitle}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {s.stepDescription}
                    </p>
                    <p className="text-xs text-slate-500">
                      Order: {s.stepOrder}
                    </p>
                    <p className="text-xs text-slate-500">
                      Total Fields: {s.fields.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openStepForm(s)}
                      className="p-2 border rounded-full text-slate-600 hover:text-black"
                    >
                      <AiTwotoneEdit size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteStep(i)}
                      className="p-2 border rounded-full text-red-500 hover:bg-red-50"
                    >
                      <RiDeleteBin5Line size={16} />
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid gap-3 md:grid-cols-2">
                  {s.fields.map((f, fi) => (
                    <div
                      key={fi}
                      className="rounded-xl bg-slate-50 p-4 border border-slate-100"
                    >
                      <p>
                        <strong>Label:</strong> {f.label}
                      </p>
                      <p>
                        <strong>Name:</strong> {f.name}
                      </p>
                      <p>
                        <strong>Type:</strong> {f.type}
                      </p>
                      {f.placeholder && (
                        <p>
                          <strong>Placeholder:</strong> {f.placeholder}
                        </p>
                      )}
                      <p>
                        <strong>Required:</strong> {f.required ? "Yes" : "No"}
                      </p>
                      {f.options?.length > 0 && (
                        <div>
                          <strong>Options:</strong>
                          <ul className="list-disc list-inside">
                            {f.options.map((opt, oi) => (
                              <li key={oi}>
                                {typeof opt === "string" ? opt : opt.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------
  // STEP FORM VIEW
  // -------------------
  return (
    <div className="space-y-6">
      <PageHeader
        title={currentStep._id ? "Edit Step" : "Add New Step"}
        description="Define the step title, description, order, and fields."
        buttonsList={[
          {
            value: "Back to steps",
            variant: "white",
            className:
              "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
            onClick: () => setCurrentStep(null),
          },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
        <select
          value={currentStep.stepType}
          onChange={(e) =>
            setCurrentStep({ ...currentStep, stepType: e.target.value })
          }
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="first">First</option>
          <option value="final">Final</option>
        </select>
        <input
          type="text"
          placeholder="Step Title"
          value={currentStep.stepTitle}
          onChange={(e) =>
            setCurrentStep({ ...currentStep, stepTitle: e.target.value })
          }
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* <textarea
          rows={3}
          placeholder="Step Description"
          value={currentStep.stepDescription}
          onChange={(e) => setCurrentStep({ ...currentStep, stepDescription: e.target.value })}
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        /> */}
        <input
          type="number"
          placeholder="Step Order"
          value={currentStep.stepOrder || ""}
          onChange={(e) =>
            setCurrentStep({
              ...currentStep,
              stepOrder: Number(e.target.value),
            })
          }
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="text-lg font-semibold">Fields</h3>
        {currentStep.fields.map((field, index) => (
          <div
            key={index}
            className="rounded-xl p-4 border border-slate-100 bg-slate-50 relative space-y-2"
          >
            <button
              onClick={() => removeField(index)}
              className="absolute -top-3 -right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-sm hover:bg-gray-600"
            >
              X
            </button>
            <input
              type="text"
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => updateField(index, "label", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            />
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, "type", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textArea">Textarea</option>
              <option value="select">Select</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="date">Date</option>
              <option value="file">File</option>
            </select>

            {!["checkbox", "radio"].includes(field.type) && (
              <input
                type="text"
                placeholder="Placeholder (optional)"
                value={field.placeholder}
                onChange={(e) =>
                  updateField(index, "placeholder", e.target.value)
                }
                className="w-full p-2 border border-slate-200 rounded"
              />
            )}

            {["select", "checkbox", "radio", "dropdown"].includes(
              field.type
            ) && (
              <div>
                <p className="font-medium mb-1">Options:</p>
                {field.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(index, oi, e.target.value)}
                      placeholder="Option value"
                      className="flex-1 p-2 border border-slate-200 rounded"
                    />
                    <button
                      onClick={() => removeOption(index, oi)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(index)}
                  className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80"
                >
                  + Add Option
                </button>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm mt-1">
              <input
                type="checkbox"
                className="!relative"
                checked={field.required}
                onChange={() => toggleRequired(index)}
              />{" "}
              Required
            </label>
          </div>
        ))}

        <button
          onClick={addField}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
        >
          + Add New Field
        </button>
        <button
          onClick={handleSaveStep}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 mt-2"
        >
          {currentStep._id ? "Update Step" : "Save Step"}
        </button>
      </div>
    </div>
  );
};

export default FixedStepsBuilder;
