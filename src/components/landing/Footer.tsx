import React from 'react';
import { Database, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030304] pt-16 pb-8 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-6 h-6 text-brand-500" />
              <span className="text-xl font-bold tracking-tight text-white">Structify</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Transforming unstructured project conversations into structured Business Requirement Documents at the speed of thought.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@structify.ai" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  <span>contact@structify.ai</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Structify AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
