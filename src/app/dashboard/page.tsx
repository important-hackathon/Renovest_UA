"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateProjectForm from "@/components/projects/CreateProjectForm";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { investorReviews } from "./investorReviews";
import Review from "@/components/dashboard/Review";
import AOS from "aos";
import "aos/dist/aos.css";

interface UserData {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    role?: "investor" | "owner";
    phone?: string;
  };
}

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInvested: 0,
  });

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 50,
    });
    
    // Custom animation for width growth
    AOS.refresh();
    document.querySelectorAll('[data-aos="width"]').forEach(element => {
      element.setAttribute('data-aos', 'fade-right');
      (element as HTMLElement).style.width = '0';
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (element as HTMLElement).style.transition = 'width 1s ease-out';
              (element as HTMLElement).style.width = ''; // Reset to CSS value
            }, parseInt(element.getAttribute('data-aos-delay') || '0'));
            observer.disconnect();
          }
        });
      });
      
      observer.observe(element);
    });

    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user as UserData);

      // Fetch stats based on user role
      if (user.user_metadata?.role === "owner") {
        const { data: projects, error } = await supabase
          .from("projects")
          .select("id")
          .eq("owner_id", user.id);

        if (!error) {
          setStats((prev) => ({
            ...prev,
            totalProjects: projects?.length || 0,
          }));
        }
      } else if (user.user_metadata?.role === "investor") {
        const { data: investments, error } = await supabase
          .from("investments")
          .select("amount")
          .eq("investor_id", user.id);

        if (!error) {
          const total = (investments || []).reduce(
            (sum, inv) => sum + Number(inv.amount),
            0
          );
          setStats((prev) => ({ ...prev, totalInvested: total }));
        }
      }
    };

    fetchUserData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const role = user.user_metadata?.role || "investor";
  const name = user.user_metadata?.name || "User";

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Header */}
      <div 
        className="bg-[#000000] rounded-xl p-8 mb-8 text-white shadow-lg"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {name}</h1>
              <p className="text-white">
                {role === "owner"
                  ? "Project Owner Dashboard"
                  : "Investor Dashboard"}
              </p>
            </div>
            <div className="hidden md:block bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              {role === "owner" ? (
                <>
                  <p className="text-sm">Active Projects:</p>
                  <p className="text-2xl font-bold text-right">
                    {stats.totalProjects}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">Invested projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-15">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats for Mobile */}
          <div 
            className="md:hidden bg-white p-6 rounded-xl shadow-sm"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {role === "owner" ? (
              <>
                <p className="text-gray-500">Your Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </>
            ) : (
              <>
                <p className="text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold">
                  ${stats.totalInvested.toLocaleString()}
                </p>
              </>
            )}
          </div>

          {/* Action Cards */}
          {role === "owner" && (
            <>
              <Link
                href="#"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#8b8e90]"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#d1d1d1] mb-2">
                  <LockKeyhole />
                </div>
                <h3 className="font-bold text-gray-900">My Messages</h3>
                <p className="text-gray-500 text-sm mt-1">Will be added soon</p>
              </Link>

              <Link
                href="/dashboard/my-projects"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#C6FF80]"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <Image
                  className="mb-2"
                  src="/assets/images/projectIcon.svg"
                  alt="Project icon"
                  width={40}
                  height={40}
                />
                <h3 className="font-bold text-gray-900">My Projects</h3>
                <p className="text-gray-500 text-sm mt-1">
                  View and manage your projects
                </p>
              </Link>

              <Link
                href="#"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#8b8e90]"
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#d1d1d1] mb-2">
                  <LockKeyhole />
                </div>

                <h3 className="font-bold text-gray-900">My Profile</h3>
                <p className="text-gray-500 text-sm mt-1">Will be added soon</p>
              </Link>
            </>
          )}

          {role === "investor" && (
            <>
              <Link
                href="#"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#8b8e90]"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#d1d1d1] mb-2">
                  <LockKeyhole />
                </div>

                <h3 className="font-bold text-gray-900">My Messages</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Communicate with others investors or project owners
                </p>
              </Link>

              <Link
                href="/dashboard/my-investments"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#C6FF80]"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <Image
                  className="mb-2"
                  src="/assets/images/projectIcon.svg"
                  alt="Message icon"
                  width={40}
                  height={40}
                />
                <h3 className="font-bold text-gray-900">My Investments</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Track your investment portfolio
                </p>
              </Link>

              <Link
                href="/projects"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center border-2 border-[#C6FF80]"
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <Image
                  className="mb-2"
                  src="/assets/images/projectIcon.svg"
                  alt="Message icon"
                  width={40}
                  height={40}
                />

                <h3 className="font-bold text-gray-900">View All Projects</h3>
                <p className="text-gray-500 text-sm mt-1">
                  See available opportunities
                </p>
              </Link>
            </>
          )}
        </div>

        {/* My Statistics */}
        <div data-aos="fade-up" data-aos-delay="600">
          <h2 className="font-bold text-2xl md:text-[32px] text-center mb-8 md:mb-15">
            My Statistics
          </h2>

          {role === "investor" && (
            <div className="flex flex-col md:flex-row justify-between gap-10 lg:gap-20 items-start">
              <div className="w-full md:w-[40%] flex flex-col gap-5 items-center">
                <div 
                  className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                  data-aos="fade-right"
                  data-aos-delay="700"
                >
                  <p className="mb-5">
                    Average Project Funding Completion Time:
                  </p>
                  <p className="font-bold">4 months</p>
                </div>

                <div 
                  className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                  data-aos="fade-right"
                  data-aos-delay="800"
                >
                  <p className="mb-5">
                    Average Project Funding Completion Time:
                  </p>
                  <p className="font-bold">4 months</p>
                </div>

                <div 
                  className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                  data-aos="fade-right"
                  data-aos-delay="900"
                >
                  <p className="mb-5">
                    Average Project Funding Completion Time:
                  </p>
                  <p className="font-bold">4 months</p>
                </div>
              </div>

              <div 
                className="w-full md:w-[60%]"
                data-aos="fade-left"
                data-aos-delay="800"
              >
                <Image
                  className="w-full h-full"
                  src="/assets/images/investor-stats.svg"
                  alt="Diagram"
                  width={300}
                  height={200}
                />
              </div>
            </div>
          )}

          {role === "owner" && (
            <div className="grid grid-col-1 md:grid-cols-2 column gap-x-6 gap-y-4">
              <div 
                className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                data-aos="zoom-in"
                data-aos-delay="700"
              >
                <p className="mb-5">Total Profile Views:</p>
                <p className="font-bold">14,500</p>
              </div>

              <div 
                className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                data-aos="zoom-in"
                data-aos-delay="800"
              >
                <p className="mb-5">Most Popular Project:</p>
                <p className="font-bold">Solar Energy Hub</p>
              </div>

              <div 
                className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                data-aos="zoom-in"
                data-aos-delay="900"
              >
                <p className="mb-5">Average Funding per Project:</p>
                <p className="font-bold">$1.77M</p>
              </div>

              <div 
                className="text-center bg-[#E2FFBF] py-4 px-16 rounded-3xl"
                data-aos="zoom-in"
                data-aos-delay="1000"
              >
                <p className="mb-5">Most Popular Category:</p>
                <p className="font-bold">Infrastructure (87%)</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div 
          className="flex justify-center mt-12"
          data-aos="fade-up"
          data-aos-delay="1100"
        >
          <button
            onClick={handleSignOut}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-8 rounded-lg text-sm transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
              data-aos="zoom-in"
              data-aos-duration="400"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CreateProjectForm />
            </div>
          </div>
        )}
      </div>

      {/*Review from investors*/}
      {role === "owner" && (
        <div 
          className="bg-black rounded-xl"
          data-aos="fade-up"
          data-aos-delay="1200"
        >
          <div className="max-w-5xl px-5 box-border mx-auto pt-12 md:pt-21 pb-16">
            <h2 className="text-white font-bold mb-16 text-2xl">
              Reviews from Investors:
            </h2>

            <div className="flex flex-col gap-10">
              {investorReviews.map((review, index) => (
                <div key={index} data-aos="fade-up" data-aos-delay={1300 + index * 100}>
                  <Review
                    investor={review.investor}
                    comment={review.comment}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}