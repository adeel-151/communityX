import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, User, Lock, Building, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  
  const { login, user, token } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && token) {
      navigate('/dashboard');
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to login. Please try again.';
      setError(msg);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-pink-500/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] left-[60%] w-[30%] h-[30%] rounded-full bg-violet-500/5 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      <div className="w-full max-w-md z-10 animate-fade-in-up">
        <Card className="bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl rounded-2xl overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500"></div>
          
          <CardHeader className="text-center pb-2 pt-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <Building className="text-white" size={30} />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Welcome to CommunityX
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Sign in to manage your society operations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            {error && (
              <div className={`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center flex items-center gap-2 justify-center ${shakeError ? 'animate-shake' : ''}`}>
                <Shield size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <Input 
                    type="email" 
                    className="pl-11 py-5 bg-white/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 rounded-xl transition-all" 
                    placeholder="admin@society.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    className="pl-11 pr-11 py-5 bg-white/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 rounded-xl transition-all" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Powered by <span className="font-semibold gradient-text">CommunityX</span> · Smart Society Management
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
