import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Hi, I'm pondjs
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Developer exploring code and building useful things
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#projects"
              className="px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              View Projects
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">About</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            I'm a developer passionate about learning new things and building
            tools that solve real problems. Currently working on improving my
            coding skills and exploring various technologies.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "JavaScript", "Python"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-sm dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "Node.js"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-sm dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {["Git", "Docker", "VS Code"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-sm dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white">Learning</h3>
              <div className="flex flex-wrap gap-2">
                {["AI/ML", "OpenClaw", "Security"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-sm dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Featured Projects</h2>
          <div className="grid gap-6">
            {[
              {
                name: "Personal Portfolio",
                description: "This website - showcases my work and activity",
                tags: ["Next.js", "TypeScript", "Tailwind"],
              },
              {
                name: "Security Tools",
                description: "Open source security auditing utilities",
                tags: ["Python", "Security"],
              },
            ].map((project) => (
              <div
                key={project.name}
                className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {project.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded text-xs dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto text-center text-zinc-500 dark:text-zinc-500">
          <p>© 2026 pondjs. Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
