import { NextResponse } from "next/server";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export async function GET() {
  try {
    // Fetch user profile
    const userRes = await fetch("https://api.github.com/users/pondz1", {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userRes.json();

    // Fetch user repositories
    const reposRes = await fetch(
      "https://api.github.com/users/pondz1/repos?sort=updated&per_page=100",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!reposRes.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const repos: GitHubRepo[] = await reposRes.json();

    // Calculate languages
    const languages: { [key: string]: number } = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const stats = {
      repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      publicRepos: repos,
      languages,
    };

    // Cache for 5 minutes
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
