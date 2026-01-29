// // import ProjectCard from "@/components/dashboard/project-card";

// // const mockProjects = [
// //   {
// //     id: "1",
// //     name: "personal-website",
// //     secretsCount: 4,
// //     updatedAt: "2 hours ago",
// //   },
// //   {
// //     id: "2",
// //     name: "saas-backend",
// //     secretsCount: 9,
// //     updatedAt: "yesterday",
// //   },
// // ];

// // export default function DashboardPage() {
// //   return (
// //     <div className="">
// //       <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3 mb-3">
// //         <span className="text-sm text-neutral-400">Vault: 🔓</span>
// //         <button className="text-sm text-neutral-300 hover:text-white">
// //           Lock vault
// //         </button>
// //       </header>

// //       <div className="mb-6 flex items-center justify-between">
// //         <h1 className="text-xl font-semibold">Projects</h1>
// //         <button className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900">
// //           + New Project
// //         </button>
// //       </div>

// //       <div className="grid gap-4 sm:grid-cols-2">
// //         {mockProjects.map((project) => (
// //           <ProjectCard key={project.id} project={project} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { createClient } from "@/lib/supabase/client";
// import { useEffect, useState } from "react";
// import ProjectCard from "@/components/dashboard/project-card";

// type Project = {
//   id: string;
//   name: string;
//   secretsCount: number;
//   updatedAt: string;
// };

// export default async function DashboardPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const supabase = createClient();
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (!user) {
//     console.error("Not authenticated");
//     return;
//   }
//   // 🔄 Fetch projects + secret counts
//   const fetchProjects = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("projects")
//       .select(
//         `
//         id,
//         name,
//         created_at,
//         secrets (count)
//       `
//       )
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Failed to fetch projects", error);
//       setLoading(false);
//       return;
//     }

//     const formatted = data.map((p: any) => ({
//       id: p.id,
//       name: p.name,
//       secretsCount: p.secrets?.[0]?.count ?? 0,
//       updatedAt: new Date(p.created_at).toLocaleString(),
//     }));

//     setProjects(formatted);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // ➕ Create project
//   const handleCreateProject = async () => {
//     const name = prompt("Project name");
//     if (!name) return;

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       console.error("User not authenticated", authError);
//       return;
//     }

//     const { error } = await supabase.from("projects").insert({
//       name,
//       user_id: user.id, // ✅ REQUIRED
//     });

//     if (error) {
//       console.error("Create project failed", error);
//       return;
//     }

//     fetchProjects();
//   };

//   return (
//     <div>
//       <header className="mb-3 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3">
//         <span className="text-sm text-neutral-400">Vault: 🔓</span>
//         <button className="text-sm text-neutral-300 hover:text-white">
//           Lock vault
//         </button>
//       </header>

//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Projects</h1>
//         <button
//           onClick={handleCreateProject}
//           className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900"
//         >
//           + New Project
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-sm text-neutral-400">Loading projects…</p>
//       ) : projects.length === 0 ? (
//         <p className="text-sm text-neutral-400">No projects yet</p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2">
//           {projects.map((project) => (
//             <ProjectCard key={project.id} project={project} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProjectCard from "@/components/dashboard/project-card";
import AddProjectModal from "@/components/modals/AddNewProject";

type Project = {
  id: string;
  name: string;
  secretsCount: number;
  updatedAt: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProject, setShowProject] = useState(false);
  const [name, setName] = useState("");
  // 🔐 Get authenticated user ONCE
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Not authenticated", error);
        setLoading(false);
        return;
      }

      setUserId(user.id);
    };

    getUser();
  }, []);

  // 🔄 Fetch projects when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          id,
          name,
          created_at,
          secrets (count)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch projects", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        secretsCount: p.secrets?.[0]?.count ?? 0,
        updatedAt: new Date(p.created_at).toLocaleString(),
      }));

      setProjects(formatted);
      setLoading(false);
    };

    fetchProjects();
  }, [userId]);

  // ➕ Create project
  const handleCreateProject = async () => {
    if (!userId) return;

    const { error } = await supabase.from("projects").insert({
      name,
      user_id: userId, // ✅ RLS-safe
    });

    if (error) {
      console.error("Create project failed", error);
      return;
    }

    // Refresh list
    const { data } = await supabase
      .from("projects")
      .select(
        `
        id,
        name,
        created_at,
        secrets (count)
      `
      )
      .order("created_at", { ascending: false });

    if (data) {
      setProjects(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          secretsCount: p.secrets?.[0]?.count ?? 0,
          updatedAt: new Date(p.created_at).toLocaleString(),
        }))
      );
    }
  };

  return (
    <div>
      <header className="mb-3 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3">
        <span className="text-sm text-neutral-400">
          Vault: {userId ? "🔓" : "🔒"}
        </span>
        <button className="text-sm text-neutral-300 hover:text-white">
          Lock vault
        </button>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <button
          onClick={() => setShowProject(true)}
          disabled={!userId}
          className="rounded bg-neutral-100 px-3 py-1.5 text-sm text-neutral-900 disabled:opacity-50"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-neutral-400">No projects yet</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      <AddProjectModal
        onClose={() => setShowProject(false)}
        onSave={handleCreateProject}
        open={showProject}
        name={name}
        setName={setName}
      />
    </div>
  );
}
