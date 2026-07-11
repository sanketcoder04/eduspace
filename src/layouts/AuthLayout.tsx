import type { PropsWithChildren } from "react";

import { Typography } from "antd";

import heroImage from "@/assets/hero.jpg";
import AppLogo from "@/components/ui/AppLogo/AppLogo";

const { Title, Paragraph } = Typography;

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="max-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================= Left Section ================= */}
        <section className="sticky top-0 hidden h-screen overflow-hidden lg:block">
          {/* Background Image */}
          <img
            src={heroImage}
            alt="Classroom"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-racing-red-950/85 via-racing-red-700/80 to-racing-red-500/70" />

          {/* Content */}
          <div className="relative flex h-screen flex-col justify-between p-12 text-white">
            {/* Logo */}
            <AppLogo size="lg" />

            {/* Bottom Content */}
            <div className="space-y-5">
              <Title level={1} className="mb-0! text-white!">
                Welcome to <span className="text-racing-red-200 font-bold">EduHub</span>
              </Title>

              <Paragraph className="mb-0! max-w-md text-lg! text-gray-100!">
                Discover the perfect teacher, join the right batch, and accelerate your learning
                journey with one powerful platform.
              </Paragraph>

              <div className="flex gap-12 pt-8">
                <div className="border-r border-gray-200 pr-8">
                  <h2 className="text-3xl font-bold">1000+</h2>
                  <p className="text-gray-200">Teachers</p>
                </div>

                <div className="border-r border-gray-200 pr-8">
                  <h2 className="text-3xl font-bold">50K+</h2>
                  <p className="text-gray-200">Students</p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold">500+</h2>
                  <p className="text-gray-200">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Right Section ================= */}
        <section className="flex items-center justify-center px-6 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
