import React, { useState, useEffect } from 'react';
import { AlertTriangle, Battery, MapPin, Radio, Clock, Eye, Shield, Zap, ChevronRight, CheckCircle, XCircle, PlayCircle, PauseCircle, Activity, Wifi, Camera, Navigation } from 'lucide-react';


const DroneSecurityHub = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'motion', location: 'Gallery 14 - Impressionist Wing', priority: 'high', time: '2:37 AM', status: 'active', aiConfidence: 87, description: 'Unidentified movement detected', threat: 'Medium' },
    { id: 2, type: 'environmental', location: 'East Wing Storage', priority: 'medium', time: '2:15 AM', status: 'monitoring', aiConfidence: 65, description: 'Temperature fluctuation detected', threat: 'Low' },
    { id: 3, type: 'system', location: 'Main Hall', priority: 'low', time: '1:52 AM', status: 'resolved', aiConfidence: 95, description: 'Routine patrol complete', threat: 'None' }
  ]);
  
  const [drones, setDrones] = useState([
    { id: 'D1', name: 'Artemis-1', status: 'responding', battery: 78, location: 'Gallery 14', mode: 'autonomous-alert', eta: '45s', assigned: true, signal: 98 },
    { id: 'D2', name: 'Artemis-2', status: 'patrolling', battery: 92, location: 'Sculpture Garden', mode: 'autonomous-patrol', eta: null, assigned: false, signal: 95 },
    { id: 'D3', name: 'Artemis-3', status: 'charging', battery: 34, location: 'Box 3 - North Wing', mode: 'standby', eta: '12m to ready', assigned: false, signal: 100 },
    { id: 'D4', name: 'Artemis-4', status: 'patrolling', battery: 85, location: 'East Wing', mode: 'autonomous-patrol', eta: null, assigned: false, signal: 97 }
  ]);

  const [aiSuggestion, setAiSuggestion] = useState({
    show: true,
    title: 'AI Tactical Recommendation',
    action: 'Deploy Artemis-2 from Sculpture Garden',
    reasoning: 'Optimal deployment: 2min ETA, 92% battery, minimal patrol disruption',
    confidence: 'High confidence - Pattern matches maintenance worker signature',
    alternatives: ['Wait for security guard confirmation', 'Send backup drone Artemis-4']
  });

  const [stats, setStats] = useState({
    activePatrols: 2,
    completedTonight: 47,
    systemUptime: 99.8,
    responseTime: '32s'
  });

  const handleAcceptRecommendation = () => {
    setAiSuggestion({...aiSuggestion, show: false});
    const newDrones = [...drones];
    newDrones[1].status = 'responding';
    newDrones[1].assigned = true;
    newDrones[1].eta = '2m';
    setDrones(newDrones);
  };

  const AlertCard = ({ alert, index }) => (
    <div 
      className={`relative border-l-4 overflow-hidden ${
        alert.priority === 'high' 
          ? 'border-red-500 bg-gradient-to-r from-red-950/40 to-red-900/20' 
          : alert.priority === 'medium' 
          ? 'border-yellow-500 bg-gradient-to-r from-yellow-950/40 to-yellow-900/20' 
          : 'border-blue-500 bg-gradient-to-r from-blue-950/40 to-blue-900/20'
      } p-4 rounded-r hover:scale-[1.01] cursor-pointer transition-all duration-300 backdrop-blur-sm`}
      style={{
        animation: `slideInLeft 0.6s ease-out ${index * 0.15}s both`
      }}
    >
      {alert.status === 'active' && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" 
             style={{animation: 'gentlePulse 3s ease-in-out infinite'}}></div>
      )}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              alert.priority === 'high' ? 'bg-red-500/20' : 
              alert.priority === 'medium' ? 'bg-yellow-500/20' : 
              'bg-blue-500/20'
            }`}>
              <AlertTriangle className={
                alert.priority === 'high' ? 'text-red-400' : 
                alert.priority === 'medium' ? 'text-yellow-400' : 
                'text-blue-400'
              } size={18} />
            </div>
            <span className="font-semibold text-white text-sm">{alert.location}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{alert.time}</span>
        </div>
        <p className="text-slate-300 text-xs mb-3 ml-8">{alert.description}</p>
        <div className="flex items-center justify-between ml-8">
          <div className="flex items-center gap-2">
            <div className="relative w-2 h-2">
              {alert.status === 'active' && (
                <div className="absolute inset-0 bg-red-500 rounded-full" 
                     style={{animation: 'gentlePulse 2s ease-in-out infinite'}}></div>
              )}
              <div className={`w-2 h-2 rounded-full ${
                alert.status === 'active' ? 'bg-red-500' : 
                alert.status === 'monitoring' ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}></div>
            </div>
            <span className="text-xs text-slate-400 capitalize ml-1">{alert.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  alert.aiConfidence > 80 ? 'bg-green-500' : 
                  alert.aiConfidence > 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{width: `${alert.aiConfidence}%`}}
              ></div>
            </div>
            <span className="text-xs text-slate-400 font-mono">{alert.aiConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const DroneCard = ({ drone, index }) => {
    const batteryColor = drone.battery > 60 ? 'from-green-500 to-emerald-600' : 
                         drone.battery > 30 ? 'from-yellow-500 to-orange-600' : 
                         'from-red-500 to-rose-600';
    
    return (
      <div 
        className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border backdrop-blur-sm
          ${drone.assigned ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-slate-700/50'} 
          hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer 
          transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
        onClick={() => setSelectedDrone(drone)}
        style={{
          animation: `fadeInUp 0.7s ease-out ${index * 0.2}s both`
        }}
      >
        {drone.assigned && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" 
               style={{animation: 'gentlePulse 3s ease-in-out infinite'}}></div>
        )}
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-lg">{drone.name}</h3>
                <div className={`w-2 h-2 rounded-full ${
                  drone.status === 'responding' ? 'bg-red-500' :
                  drone.status === 'patrolling' ? 'bg-green-500' :
                  drone.status === 'charging' ? 'bg-yellow-500' :
                  'bg-purple-500'
                }`} style={{
                  animation: drone.status !== 'charging' ? 'gentlePulse 2s ease-in-out infinite' : 'none'
                }}></div>
              </div>
              <p className={`text-sm font-medium capitalize ${
                drone.status === 'responding' ? 'text-red-400' :
                drone.status === 'patrolling' ? 'text-green-400' :
                drone.status === 'charging' ? 'text-yellow-400' :
                'text-purple-400'
              }`}>{drone.status}</p>
            </div>
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${batteryColor} opacity-20 blur-lg rounded-full`}></div>
              <div className="relative bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Battery className={`${
                    drone.battery > 60 ? 'text-green-400' : 
                    drone.battery > 30 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`} size={18} />
                  <span className={`text-sm font-bold ${
                    drone.battery > 60 ? 'text-green-400' : 
                    drone.battery > 30 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>{drone.battery}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg">
              <MapPin size={14} className="text-blue-400" />
              <span>{drone.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg">
              <Radio size={14} className="text-purple-400" />
              <span className="capitalize">{drone.mode.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              {drone.eta && (
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg flex-1">
                  <Clock size={14} className="text-orange-400" />
                  <span>ETA: {drone.eta}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg">
                <Wifi size={14} className="text-green-400" />
                <span>{drone.signal}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, icon: Icon, color, index }) => (
    <div 
      className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-300 overflow-hidden group"
      style={{
        animation: `fadeInDown 0.6s ease-out ${index * 0.12}s both`
      }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} opacity-20`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 p-6 relative overflow-hidden">
      {/* Animated background elements - slower animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" 
             style={{animation: 'gentleFloat 8s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" 
             style={{animation: 'gentleFloat 10s ease-in-out infinite 3s'}}></div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gentlePulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        @keyframes gentleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
          }
          50% { 
            transform: translateY(20px) translateX(20px);
          }
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl">
                  <Shield className="text-white" size={32} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  ARTEMIS
                </h1>
                <p className="text-sm text-slate-400 font-medium">Autonomous Response & Threat Evaluation System</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Le Musée d'Art Précieux</p>
                <p className="text-xl font-bold text-white font-mono">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
              <div className="relative w-4 h-4">
                {alerts.some(a => a.priority === 'high' && a.status === 'active') && (
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500" 
                       style={{animation: 'gentlePulse 2s ease-in-out infinite'}}></div>
                )}
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${
                  alerts.some(a => a.priority === 'high' && a.status === 'active') 
                    ? 'bg-red-500' 
                    : 'bg-green-500'
                }`}></div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Active Patrols" value={stats.activePatrols} icon={Activity} color="from-blue-500 to-cyan-500" index={0} />
            <StatCard label="Completed Tonight" value={stats.completedTonight} icon={CheckCircle} color="from-green-500 to-emerald-500" index={1} />
            <StatCard label="System Uptime" value={`${stats.systemUptime}%`} icon={Shield} color="from-purple-500 to-pink-500" index={2} />
            <StatCard label="Avg Response" value={stats.responseTime} icon={Zap} color="from-orange-500 to-red-500" index={3} />
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex gap-3 mb-6">
          {['overview', 'map', 'analytics'].map((view, i) => (
            <button 
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-6 py-2.5 rounded-lg font-medium capitalize transition-all duration-300 ${
                activeView === view 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700/50'
              }`}
              style={{
                animation: `fadeInDown 0.6s ease-out ${i * 0.12}s both`
              }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* AI Suggestion Banner */}
        {aiSuggestion.show && alerts.some(a => a.priority === 'high' && a.status === 'active') && (
          <div className="relative bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 border border-purple-500/50 rounded-xl p-5 mb-6 backdrop-blur-md overflow-hidden group"
            style={{animation: 'fadeInDown 0.7s ease-out 0.4s both'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" 
                 style={{animation: 'gentlePulse 4s ease-in-out infinite'}}></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Zap className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{aiSuggestion.title}</h3>
                    <p className="text-purple-300 text-xs mt-0.5">Powered by Neural Threat Analysis</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAiSuggestion({...aiSuggestion, show: false})} 
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-white font-semibold text-lg">{aiSuggestion.action}</p>
                <p className="text-sm text-slate-300 bg-slate-900/30 px-4 py-2 rounded-lg">{aiSuggestion.reasoning}</p>
                <p className="text-sm text-purple-300 flex items-center gap-2">
                  <Activity size={14} />
                  {aiSuggestion.confidence}
                </p>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handleAcceptRecommendation}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
                  >
                    Accept Recommendation
                  </button>
                  <button className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-lg font-semibold transition-all duration-300 border border-slate-700/50 backdrop-blur-sm">
                    View Alternatives
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Column */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-5 border border-slate-800/50 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  Active Alerts
                </h2>
                <div className="relative">
                  <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                    {alerts.filter(a => a.status === 'active').length}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, i) => <AlertCard key={alert.id} alert={alert} index={i} />)}
              </div>
            </div>
          </div>

          {/* Drone Fleet Status */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-5 border border-slate-800/50 shadow-2xl mb-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Radio size={20} className="text-blue-400" />
                </div>
                Drone Fleet Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drones.map((drone, i) => <DroneCard key={drone.id} drone={drone} index={i} />)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-5 border border-slate-800/50 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: PlayCircle, label: 'Deploy All', color: 'from-blue-600 to-blue-700', hoverColor: 'hover:from-blue-700 hover:to-blue-800' },
                  { icon: PauseCircle, label: 'Pause Patrols', color: 'from-slate-700 to-slate-800', hoverColor: 'hover:from-slate-600 hover:to-slate-700' },
                  { icon: Camera, label: 'Live Feed', color: 'from-slate-700 to-slate-800', hoverColor: 'hover:from-slate-600 hover:to-slate-700' },
                  { icon: Shield, label: 'Emergency', color: 'from-red-600 to-red-700', hoverColor: 'hover:from-red-700 hover:to-red-800' }
                ].map((action, i) => (
                  <button 
                    key={i}
                    className={`bg-gradient-to-br ${action.color} ${action.hoverColor} text-white py-4 px-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg font-medium`}
                    style={{animation: `fadeInUp 0.6s ease-out ${i * 0.15 + 1}s both`}}
                  >
                    <action.icon size={24} />
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-6 bg-slate-900/40 backdrop-blur-md rounded-xl p-4 border border-slate-800/50 shadow-2xl"
          style={{animation: 'fadeInUp 0.6s ease-out 1.4s both'}}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <span className="text-slate-400">System Status: <span className="text-green-400 font-bold">Operational</span></span>
              <span className="text-slate-400">Guards on Duty: <span className="text-white font-bold">24</span></span>
              <span className="text-slate-400">Last Check: <span className="text-white font-bold font-mono">2:30 AM</span></span>
            </div>
            <div className="text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" 
                   style={{animation: 'gentlePulse 2s ease-in-out infinite'}}></div>
              Operator: <span className="text-white font-bold">Isabelle M.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneSecurityHub;