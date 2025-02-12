import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
    const [handicap, setHandicap] = useState('');

    // Hook pour la navigation
    const navigate = useNavigate();

    // Adresse IP de l'API
    const ipaddress = 'localhost';

    // Fonction pour formater la date de naissance au format ISO
    const formatISOBirthdate = (date: string) => {
        return new Date(date).toISOString().split('T')[0]; // Format : YYYY-MM-DD
    };

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

        try {
            // 1. Créer un utilisateur avec Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Envoyer les données à votre API
            const response = await fetch(`http://${ipaddress}/api/user`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    birthdate: formatISOBirthdate(birthdate),
                    email,
                    tel,
                    password,
                    civility,
                    note,
                    handicap: 1, // Remplacez par la valeur appropriée
                    googleUUID: user.uid, // Utilisez l'UID de Firebase comme identifiant unique
                }),
            });

            // Vérifier la réponse de l'API
            if (!response.ok) {
                console.error(`Erreur API : ${response.status} - ${response.statusText}`);
                alert('Erreur lors de l\'envoi des données à l\'API.');
                return;
            }

            // Si tout est réussi
            console.log('Utilisateur enregistré avec succès et ajouté à l\'API !');
            alert('Inscription réussie !');
            navigate('/login'); // Rediriger vers la page de connexion
        } catch (error: any) {
            // Gérer les erreurs Firebase ou API
            console.error('Erreur lors de l\'inscription :', error.message);
            if (error.code === 'auth/email-already-in-use') {
                alert('Cet e-mail est déjà utilisé.');
            } else {
                alert('Une erreur s\'est produite lors de l\'inscription.');
            }
        }
    };

    // Le reste de votre code (JSX) reste inchangé
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false} />

            {/* Contenu principal centré */}
            <main className="flex-grow flex items-center justify-center p-4 mt-8">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Civilité */}
                        <div className="flex justify-start">
                            <div className="w-64">
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

                        {/* Nom et Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="w-64">
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

                        {/* Prénom et Mot de passe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
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

                        {/* Date de naissance et Confirmation du mot de passe */}
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

                        {/* Handicap et Téléphone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-64">
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

                        {/* Note */}
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
                                className="w-1/2 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500"
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