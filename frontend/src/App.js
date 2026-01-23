import { useEffect, useState } from "react";
import { Trash2, UserPlus, Mail, GraduationCap, Users } from "lucide-react";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    level: ""
  });

const API = `${process.env.REACT_APP_API_URL}/students`;  // Remplacement ici : utilise l'env var injectée au build
  const loadStudents = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStudent = () => {
    if (!form.name || !form.email || !form.level) return;
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ name: "", email: "", level: "" });
      loadStudents();
    });
  };

  const deleteStudent = id => {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(loadStudents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header avec effet glassmorphism */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Student Hub
              </h1>
              <p className="text-gray-600 text-sm">Gérez vos étudiants avec style</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Formulaire d'ajout avec design moderne */}
        <div className="mb-8 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-2 text-white">
              <UserPlus className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Ajouter un étudiant</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="level"
                  placeholder="Niveau (ex: L1, M2)"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={addStudent}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-200"
            >
              Ajouter l'étudiant
            </button>
          </div>
        </div>

        {/* Liste des étudiants */}
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <Users className="w-5 h-5" />
          <span className="font-medium">
            {students.length} étudiant{students.length > 1 ? 's' : ''} enregistré{students.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((s, index) => (
            <div
              key={s.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeIn 0.5s ease-out forwards',
                opacity: 0
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Mail className="w-3 h-3" />
                        <span>{s.email}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteStudent(s.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  <GraduationCap className="w-4 h-4" />
                  <span>Niveau {s.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Aucun étudiant enregistré</p>
            <p className="text-gray-400 text-sm mt-1">Commencez par ajouter votre premier étudiant</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;