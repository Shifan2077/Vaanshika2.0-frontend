// File: src/pages/FamilyTreePage.jsx
// Family tree page with visualization and member management

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../contexts/FamilyContext";
import FamilyTreeVisualization from "../components/family/FamilyTreeVisualization";
import FamilyMemberForm from "../components/family/FamilyMemberForm";
import Loader from "../components/common/Loader";
import "../styles/treeStyles.css";
import familyService from "../services/familyService";
import { toast } from "react-hot-toast";

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const {
    familyTree,
    familyTrees,
    treeData,
    familyMembers,
    loading: contextLoading,
    error: contextError,
    fetchFamilyTree,
    fetchAllFamilyTrees,
    createTree,
    addMember,
    updateMember,
    removeMember,
    deleteTree,
    setFamilyTree,
    setFamilyMembers,
    setError: setContextError,
    selectedTreeId,
    setSelectedTreeId,
  } = useFamily();

  // Add local state for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
  const [parentId, setParentId] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [showNewTreeForm, setShowNewTreeForm] = useState(false);
  const [newTreeData, setNewTreeData] = useState({ name: "", description: "" });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    deathDate: "",
    isAlive: true,
    location: "",
    occupation: "",
    bio: "",
    contactInfo: {
      email: "",
      phone: "",
    },
    relationshipType: "other",
  });

  // Load family trees data from backend
  useEffect(() => {
    console.log("FamilyTreePage: Fetching all family trees");
    fetchAllFamilyTrees();
  }, [fetchAllFamilyTrees]);

  // Log when family trees data changes
  useEffect(() => {
    console.log("FamilyTreePage: familyTrees updated:", familyTrees);
  }, [familyTrees]);

  // Handle node click in the tree visualization
  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    setSelectedNode(node);
    setShowMemberDetails(true);

    // If the node is a family unit, we need to handle it differently
    if (
      node.type === "familyUnit" ||
      (node.attributes && node.attributes.type === "familyUnit")
    ) {
      // If a specific spouse was clicked (has spouseIndex), select that spouse
      if (node.spouseIndex !== undefined) {
        const spouse = node.attributes.spouses[node.spouseIndex];
        setSelectedMember({
          ...spouse,
          id: spouse.id || spouse._id,
          attributes: spouse,
        });
      } else {
        // Otherwise, select the first spouse as default
        const primarySpouse = node.attributes.spouses[0];
        setSelectedMember({
          ...primarySpouse,
          id: primarySpouse.id || primarySpouse._id,
          attributes: primarySpouse,
        });
      }
    } else {
      // Regular member node
      setSelectedMember({
        ...node,
        id: node.id,
        attributes: node.attributes || {},
      });
    }
  };

  // Handle adding a family member (child, parent, or partner)
  const handleAddChild = (node) => {
    console.log("Adding family member to node:", node);

    // Get the relationship mode from the node or default to 'child'
    const relationshipMode = node.relationshipMode || "child";

    setSelectedNode({
      ...node,
      relationshipMode,
    });
    setFormMode("add");
    setShowForm(true);
  };

  // Handle editing a member
  const handleEditMember = (nodeDatum) => {
    setSelectedMember(nodeDatum);
    setFormMode("edit");
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Handle deleting a member
  const handleDeleteMember = async (nodeDatum) => {
    if (window.confirm(`Are you sure you want to delete ${nodeDatum.name}?`)) {
      try {
        await removeMember(nodeDatum.id);
      } catch (err) {
        console.error("Error deleting member:", err);
      }
    }
  };

  // Handle form submission for adding/editing members
  const handleFormSubmit = async (formData) => {
    if (!selectedTree) {
      toast.error("Please select a family tree first");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting form data:", formData);

      // Add the tree ID to the form data
      const memberData = {
        ...formData,
        treeId: selectedTree._id,
      };

      // Call the addMember function from FamilyContext
      await addMember(memberData);

      // Show success message
      toast.success("Family member added successfully!");

      // Reset form mode
      setFormMode("view");

      // Refresh the family tree data
      await fetchFamilyTree(selectedTree._id);

      // Wait for the family members to be loaded
      let retryCount = 0;
      const maxRetries = 5;
      const checkInterval = 1000; // 1 second

      const checkMembers = async () => {
        if (familyMembers && familyMembers.length > 0) {
          console.log("Family members loaded successfully:", familyMembers);
          return true;
        }

        if (retryCount >= maxRetries) {
          console.error("Failed to load family members after retries");
          return false;
        }

        retryCount++;
        console.log(
          `Retrying to load family members (attempt ${retryCount}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
        await fetchFamilyTree(selectedTree._id);
        return checkMembers();
      };

      const success = await checkMembers();
      if (!success) {
        toast.error(
          "Failed to refresh family tree data. Please try refreshing the page."
        );
      }
    } catch (error) {
      console.error("Error adding family member:", error);
      toast.error(
        error.response?.data?.message || "Failed to add family member"
      );
    } finally {
      setLoading(false);
    }
  };

  // Close member details panel
  const handleCloseDetails = () => {
    setShowMemberDetails(false);
    setSelectedMember(null);
  };

  // Close form panel
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedNode(null);
  };

  // Start a new family tree
  const handleStartNewTree = () => {
    setShowNewTreeForm(true);
  };

  // Handle new tree form input changes
  const handleNewTreeInputChange = (e) => {
    const { name, value } = e.target;
    setNewTreeData({
      ...newTreeData,
      [name]: value,
    });
  };

  // Create a new family tree
  const handleCreateNewTree = async (e) => {
    e.preventDefault();

    if (!newTreeData.name) {
      toast.error("Please provide a name for your family tree");
      return;
    }

    setLoading(true);

    try {
      console.log("Creating new family tree with data:", newTreeData);

      const result = await createTree(newTreeData);
      console.log("Create tree response:", result);

      if (result && result.success) {
        toast.success("Family tree created successfully!");
        setShowNewTreeForm(false);
        setNewTreeData({ name: "", description: "" });

        // Extract the tree ID from the response
        const treeId = result.treeId || result.data?._id || result.data?.id;

        if (treeId) {
          // Format the tree ID to ensure it's a string and trimmed
          const formattedTreeId = String(treeId).trim();
          console.log("Setting selected tree ID to:", formattedTreeId);

          // Set the selected tree ID
          setSelectedTreeId(formattedTreeId);

          // Fetch the newly created tree data
          await fetchFamilyTree(formattedTreeId);

          // Reset any previous form data
          setFormData({
            firstName: "",
            lastName: "",
            gender: "male",
            birthDate: "",
            deathDate: "",
            isAlive: true,
            location: "",
            occupation: "",
            bio: "",
            contactInfo: {
              email: "",
              phone: "",
            },
            relationshipType: "other",
          });

          // Show the form to add the root member
          setFormMode("add");
          setParentId(null); // Ensure no parent ID is set for the root member
          setSelectedNode(null); // No selected node for the root member

          // Set a flag to indicate this is the first member (root)
          setFormData((prev) => ({
            ...prev,
            isRoot: true, // Add a flag to indicate this is the root member
            treeId: formattedTreeId, // Explicitly set the tree ID
          }));

          setShowForm(true);

          // Display a helpful message
          toast.info("Now add the first member to your family tree", {
            duration: 5000,
          });

          // Scroll to the form to make it visible
          setTimeout(() => {
            const formElement = document.getElementById("member-form");
            if (formElement) {
              formElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        } else {
          console.error("No tree ID returned from createTree");
          toast.error(
            "Tree created but ID not returned. Please refresh the page."
          );
        }
      } else {
        console.error(
          "Failed to create tree:",
          result?.message || "Unknown error"
        );
        toast.error(result?.message || "Failed to create family tree");
      }
    } catch (error) {
      console.error("Error creating family tree:", error);
      toast.error("Failed to create family tree. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Select a family tree to view
  const handleSelectTree = async (treeId) => {
    // Ensure the tree ID is properly formatted
    const formattedTreeId = String(treeId).trim();
    console.log("Selecting tree with ID:", formattedTreeId);

    try {
      setLoading(true);
      setError(null);

      // Use the context function to fetch the family tree and its members
      await fetchFamilyTree(formattedTreeId);

      // Verify that we have tree data after fetching
      if (!treeData) {
        console.log(
          "Tree data not available after fetching, waiting for useEffect to process it"
        );
      }

      toast.success("Family tree loaded successfully");
    } catch (err) {
      console.error("Error loading family tree:", err);
      setError("Failed to load the selected family tree. Please try again.");
      toast.error("Failed to load the selected family tree. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a family tree
  const handleDeleteTree = async (treeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this family tree? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        await deleteTree(treeId);
        // If the deleted tree was the selected one, clear the selection
        if (treeId === selectedTreeId) {
          setSelectedTreeId(null);
        }
      } catch (err) {
        console.error("Error deleting family tree:", err);
        setError("Failed to delete the family tree. Please try again.");
        alert("Failed to delete the family tree. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Go back to the list of family trees
  const handleBackToList = () => {
    setSelectedTreeId(null);
    setFamilyTree(null);
    setFamilyMembers([]);
  };

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || contextLoading) {
    return <Loader text="Loading family trees..." />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Always visible */}
      <div className="bg-transparent p-4">
        <div className="container mx-auto flex justify-between items-center">
          {selectedTreeId && treeData ? (
            <>
              <div className="flex items-center">
                <button
                  onClick={handleBackToList}
                  className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">
                  {familyTree?.name || "Family Tree"}
                </h1>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">
                Family Trees
              </h1>
              <button
                onClick={handleStartNewTree}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Create New Tree
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Tree Visualization View */}
        {selectedTreeId && treeData ? (
          <div className="h-full w-full">
            <FamilyTreeVisualization
              treeData={treeData}
              onNodeClick={handleNodeClick}
              onAddChild={handleAddChild}
              onEditNode={handleEditMember}
              onDeleteNode={handleDeleteMember}
            />
          </div>
        ) : (
          <div className="container mx-auto p-4 md:p-6">
            {/* Family Trees List */}
            {!showNewTreeForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyTrees && familyTrees.length > 0 ? (
                  familyTrees.map((tree) => (
                    <motion.div
                      key={tree.id || tree._id}
                      className="card-glass p-6 rounded-xl hover:shadow-glass-strong transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectTree(tree.id || tree._id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                            {tree.image ? (
                              <img
                                src={tree.image}
                                alt={tree.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-2xl">🌳</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {tree.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Created {formatDate(tree.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(tree.id || tree._id);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {dropdownOpen === (tree.id || tree._id) && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTree(tree.id || tree._id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Delete Tree
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {tree.description && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                          {tree.description}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-5xl mb-4">🌱</div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0 mb-2">
                      No Family Trees Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start your first family tree to begin documenting your
                      family history and connections.
                    </p>
                    <button
                      onClick={handleStartNewTree}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                      Create Your First Tree
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* New Tree Form */}
            {showNewTreeForm && (
              <motion.div
                className="card-glass p-6 rounded-xl max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0 mb-6">
                  Create New Family Tree
                </h2>

                <form onSubmit={handleCreateNewTree}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tree Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newTreeData.name}
                      onChange={handleNewTreeInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. Smith Family Tree"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={newTreeData.description}
                      onChange={handleNewTreeInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="A brief description of your family tree"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewTreeForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Tree"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}

        {/* Member Form - Overlay on top of visualization */}
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">
                  {formMode === "add"
                    ? "Add Family Member"
                    : "Edit Family Member"}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <FamilyMemberForm
                mode={formMode}
                initialData={formMode === "edit" ? selectedMember : null}
                parentId={selectedNode?.id}
                isAddingSpouse={selectedNode?.isAddingSpouse}
                relationshipMode={selectedNode?.relationshipMode || "child"}
                onSubmit={handleFormSubmit}
                onClose={() => {
                  setShowForm(false);
                  setSelectedNode(null);
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Member Details - Overlay on top of visualization */}
        {showMemberDetails && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseDetails();
              }
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/50 dark:to-secondary-900/50 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6">
                {/* Background animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[100px] opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-primary-300 via-accent-300 to-secondary-300 dark:from-primary-600 dark:via-accent-600 dark:to-secondary-600 animate-slow-spin rounded-full blur-3xl"></div>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">
                      {selectedMember.attributes?.firstName}{" "}
                      {selectedMember.attributes?.lastName}
                    </h2>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-center mb-6">
                    {selectedMember.attributes?.photoURL ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
                        <img
                          src={selectedMember.attributes.photoURL}
                          alt={`${selectedMember.attributes?.firstName} ${selectedMember.attributes?.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-300 border-4 border-white shadow-lg mb-3">
                        {selectedMember.attributes?.firstName?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMember.attributes?.gender && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Gender
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {selectedMember.attributes.gender
                              .charAt(0)
                              .toUpperCase() +
                              selectedMember.attributes.gender.slice(1)}
                          </p>
                        </div>
                      )}

                      {selectedMember.attributes?.dateOfBirth && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Birth Date
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {new Date(
                              selectedMember.attributes.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedMember.attributes?.dateOfDeath && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Death Date
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {new Date(
                              selectedMember.attributes.dateOfDeath
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedMember.attributes?.location && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Location
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {selectedMember.attributes.location}
                          </p>
                        </div>
                      )}

                      {selectedMember.attributes?.occupation && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Occupation
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {selectedMember.attributes.occupation}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedMember.attributes?.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Bio
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedMember.attributes.bio}
                        </p>
                      </div>
                    )}

                    {/* Social Media Links */}
                    {selectedMember.attributes?.socialMedia && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Social Media
                        </h4>
                        <div className="flex space-x-4">
                          {selectedMember.attributes.socialMedia.facebook && (
                            <a
                              href={
                                selectedMember.attributes.socialMedia.facebook
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Facebook
                            </a>
                          )}
                          {selectedMember.attributes.socialMedia.twitter && (
                            <a
                              href={
                                selectedMember.attributes.socialMedia.twitter
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-600"
                            >
                              Twitter
                            </a>
                          )}
                          {selectedMember.attributes.socialMedia.instagram && (
                            <a
                              href={
                                selectedMember.attributes.socialMedia.instagram
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-800"
                            >
                              Instagram
                            </a>
                          )}
                          {selectedMember.attributes.socialMedia.linkedin && (
                            <a
                              href={
                                selectedMember.attributes.socialMedia.linkedin
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-800 hover:text-blue-900"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditMember(selectedMember)}
                      className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-colors shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAddChild(selectedMember)}
                      className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg transition-colors shadow-md"
                    >
                      Add Child
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FamilyTreePage;
