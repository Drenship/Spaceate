// Importer la classe URL pour analyser l'URL
import { URL } from 'url';

/**
 * Vérifie si l'origine des requêtes provient du même site que celui qui la reçoit.
 * @param requestOrigin L'origine de la requête.
 * @param targetUrl L'URL cible du site qui reçoit la requête.
 * @returns Retourne true si l'origine est la même, sinon false.
 */

export function isSameOrigin(requestOrigin: string, targetUrl: string): boolean {
    try {
        const parsedRequestOrigin = new URL(requestOrigin);
        const parsedTargetUrl = new URL(targetUrl);

        // Comparer l'origine de la requête et l'URL cible
        return (
            parsedRequestOrigin.protocol === parsedTargetUrl.protocol &&
            parsedRequestOrigin.hostname === parsedTargetUrl.hostname &&
            parsedRequestOrigin.port === parsedTargetUrl.port
        );
    } catch (error) {
        return false;
    }
}