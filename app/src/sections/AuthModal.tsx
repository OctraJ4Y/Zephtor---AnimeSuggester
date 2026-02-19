import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/userStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  const { login, signup } = useUserStore();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          onClose();
          setSuccess('');
          setLoginEmail('');
          setLoginPassword('');
        }, 1000);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (signupUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(signupUsername, signupEmail, signupPassword);
      if (success) {
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onClose();
          setSuccess('');
          setSignupUsername('');
          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirmPassword('');
        }, 1000);
      } else {
        setError('Email or username already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setError('');
    setSuccess('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to AnimeHub
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          resetForm();
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0f0f0f]">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-purple-600">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="pl-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </TabsContent>
          
          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-gray-300">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Your username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                    minLength={3}
                    className="pl-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="pl-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 pr-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    className="pl-10 bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
