module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        require.resolve("expo-router/babel"), // Plugin Expo Router
        [
          "module:react-native-dotenv",
          {
            moduleName: "@env", // Nom du module pour importer les variables
            path: ".env",       // Chemin vers ton fichier .env
          },
        ],
      ],
    };
  };