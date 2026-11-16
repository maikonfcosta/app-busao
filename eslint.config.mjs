import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
                GameLogic: "writable",
                CameraHandler: "writable",
                PLAYMAT_COORDINATES: "readonly",
                FOCUS_ZONES: "readonly",
                ALL_AVAILABLE_CARDS: "readonly",
                extractScoreNumber: "readonly",
                findClosestCard: "readonly",
                matchCardsInZone: "readonly",
                levenshteinDistance: "readonly",
                processScanResult: "readonly",
                Tesseract: "readonly",
                html2canvas: "readonly",
                ROWS: "readonly",
                COLS: "readonly",
                DRIVERS: "readonly",
                IMPROVEMENTS: "readonly",
                PERRENGUES: "readonly",
                ROTAS_DIARIAS: "readonly",
                CARD_DB: "readonly",
                COBRADORES: "readonly",
                APAIXONADOS: "readonly",
                ESTOU_NO_BUSAO: "readonly",
                LENDAS_URBANAS: "readonly",
                GRUPO_PAGODE: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["warn", {
                "varsIgnorePattern": "^(processScanResult|findClosestCard|CameraHandler|extractScoreNumber|matchCardsInZone|levenshteinDistance)",
                "argsIgnorePattern": "^_"
            }],
            "no-undef": "error"
        }
    }
];
