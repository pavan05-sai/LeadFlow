import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', source: 'website' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/leads', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', source: 'website' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 text-center">
        <div className="glass rounded-3xl p-12 max-w-md animate-fadeIn">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-surface-100 mb-4">Message Sent!</h1>
          <p className="text-surface-400 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-smooth cursor-pointer"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <div className="glass rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn border border-primary-500/10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Get in Touch</h1>
          <p className="text-surface-400 mt-2">Have a project in mind? We'd love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-smooth"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Email Address</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-smooth"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-smooth"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg border border-danger/20">
              <AlertCircle className="w-4 h-4" />
              Failed to send. Please try again later.
            </div>
          )}

          <button
            disabled={status === 'loading'}
            type="submit"
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-smooth flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-primary-600/20 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Inquiry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
