import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // État pour la visibilité du mot de passe
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêcher le rechargement de la page
        setError(''); // Réinitialiser les erreurs
        setLoading(true); // Activer l'état de chargement

        try {
            // Simuler une connexion réussie (sans Firebase pour l'instant)
            console.log('Email:', email);
            console.log('Mot de passe:', password);

            // Simuler un délai pour le chargement
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Rediriger vers le tableau de bord après la "connexion"
            navigate('/dashboard');
        } catch (error) {
            setError('Erreur de connexion : Identifiants incorrects'); // Afficher une erreur simulée
        } finally {
            setLoading(false); // Désactiver l'état de chargement
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false} />

            {/* Contenu de la page de connexion */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

                    {/* Afficher les erreurs */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    {/* Formulaire de connexion */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Adresse email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} // Basculer entre 'text' et 'password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)} // Basculer l'état de visibilité
                                    className="absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? 'Masquer' : 'Afficher'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#9ca3af] text-white p-1.5 rounded-md hover:bg-[#7f8a9a] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:bg-[#7f8a9a] text-sm"
                        >
                            {loading ? 'Chargement...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Lien vers la page d'inscription */}
                    <div className="mt-4 text-center">
                        <p>
                            Vous n'avez pas de compte ?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-600">
                                Inscrivez-vous ici
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Login;