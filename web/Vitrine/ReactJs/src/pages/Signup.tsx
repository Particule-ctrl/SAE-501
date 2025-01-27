import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const Signup = () => {
    // États pour les champs du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [civility, setCivility] = useState('');
    const [tel, setTel] = useState('');
    const [note, setNote] = useState('');

    // État pour le handicap sélectionné
    const [handicap, setHandicap] = useState('');

    // Hook pour la navigation
    const navigate = useNavigate();

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des champs obligatoires
        if (!civility || !firstName || !lastName || !birthdate || !email || !tel || !password || !confirmPassword) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Vérification que les mots de passe correspondent
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        // Envoi des données au serveur (simulé ici avec un console.log)
        try {
            const response = await fetch('https://votre-api.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    civility,
                    firstName,
                    lastName,
                    birthdate,
                    email,
                    tel,
                    password,
                    note,
                    handicap,
                }),
            });

            if (response.ok) {
                alert('Inscription réussie !');
                navigate('/login'); // Rediriger vers la page de connexion
            } else {
                alert('Erreur lors de l\'inscription.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur s\'est produite.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false} />

            {/* Contenu principal centré */}
            <main className="flex-grow flex items-center justify-center p-4 mt-8"> {/* Ajout de mt-8 pour l'espace */}
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl"> {/* Réduction de max-w-4xl à max-w-2xl */}
                    <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 1ère ligne : Civilité */}
                        <div className="flex justify-start">
                            <div className="w-64"> {/* Largeur fixe de 16rem (environ 30 caractères) */}
                                <label className="block text-sm font-medium text-gray-700">Civilité</label>
                                <select
                                    value={civility}
                                    onChange={(e) => setCivility(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Aucun</option>
                                    <option value="Monsieur">Monsieur</option>
                                    <option value="Madame">Madame</option>
                                </select>
                            </div>
                        </div>

                        {/* 2ème ligne : Nom et Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64"> {/* Largeur fixe de 16rem (environ 30 caractères) */}
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64"> {/* Largeur fixe de 16rem (environ 30 caractères) */}
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3ème ligne : Prénom et Mot de passe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64"> {/* Largeur fixe de 16rem (environ 30 caractères) */}
                                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 px-3 py-2"
                                    >
                                        {showPassword ? 'Masquer' : 'Afficher'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4ème ligne : Date de naissance et Confirmation du mot de passe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 px-3 py-2"
                                    >
                                        {showConfirmPassword ? 'Masquer' : 'Afficher'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 5ème ligne : Handicap et Téléphone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64"> {/* Largeur fixe de 16rem (environ 30 caractères) */}
                                <label className="block text-sm font-medium text-gray-700">Quel est votre handicap ?</label>
                                <select
                                    value={handicap}
                                    onChange={(e) => setHandicap(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Aucun</option>
                                    <option value="Visuel">Visuel</option>
                                    <option value="Auditif">Auditif</option>
                                    <option value="Moteur">Moteur</option>
                                    <option value="Mental">Mental</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>

                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="tel"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* 6ème ligne : Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-1/2 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500" // Changement de bg-blue-500 à bg-gray-400
                            >
                            S'inscrire
                        </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Signup;