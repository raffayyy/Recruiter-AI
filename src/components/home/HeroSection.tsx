import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { BriefcaseIcon, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
      </div>
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 dark:bg-blue-900/50">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  AI-Powered Recruitment
                </span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Transform Your{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Hiring Process
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 h-2 bg-blue-200/30" />
                </span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                Leverage AI-powered recruitment to find the perfect candidates faster and smarter than ever before.
                Experience the future of hiring today.
              </p>
              <div className="mt-8 flex justify-center gap-4 lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="group px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="px-8"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2940"
                  alt="Dashboard preview"
                  className="rounded-xl shadow-2xl transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gray-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}