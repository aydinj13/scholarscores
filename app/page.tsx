import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, School, Calendar, Trophy, ChartBar, Phone, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <School className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Scholar Scores</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
            <Link href="/register-school" className="text-gray-600 hover:text-blue-600">Register School</Link>
            <Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild><Link href="/sign-in">Sign In</Link></Button>
            <Button asChild><Link href="/sign-up">Sign Up</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Your School&apos;s Stats, All in One Place</h1>
            <p className="text-xl text-gray-600 mb-8">
              Access scores, schedules, and statistics from schools across the nation. 
              Stay connected with your school&apos;s athletic and academic achievements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Register Your School
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Trophy />}
              title="Sports Scores"
              description="Real-time updates on all your school's sporting events and achievements"
            />
            <FeatureCard 
              icon={<Calendar />}
              title="Event Schedule"
              description="Stay updated with upcoming games, meets, and academic events"
            />
            <FeatureCard 
              icon={<ChartBar />}
              title="Statistics"
              description="Comprehensive statistics and analytics for teams and players"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of schools nationwide in providing better access to sports and academic information.
          </p>
          <Button size="lg" variant="secondary">
            Register Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">EduStats</h3>
              <p className="text-gray-600">Making school statistics accessible to everyone.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                <li><Link href="/features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
                <li><Link href="/help" className="text-gray-600 hover:text-blue-600">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1-800-EDUSTATS</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@edustats.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 EduStats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};