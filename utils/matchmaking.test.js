// utils/matchmaking.test.js
const { canJoinReta, kickPlayer } = require('./matchmaking');

describe('Matchmaking Logic - Unirse a Reta', () => {

    test('No debe permitir unirse si la reta está llena', () => {
        const result = canJoinReta(10, 10, 'intermediate', 'intermediate');
        expect(result.success).toBe(false);
        expect(result.message).toBe("La reta está llena.");
    });

    test('Debe mandar un warning si un beginner entra a una reta advanced', () => {
        const result = canJoinReta(5, 10, 'beginner', 'advanced');
        expect(result.success).toBe(true);
        expect(result.warning).toBe(true);
        expect(result.message).toContain("Advertencia");
    });

    test('Debe permitir unirse normalmente sin warnings si el nivel coincide', () => {
        const result = canJoinReta(5, 10, 'intermediate', 'intermediate');
        expect(result.success).toBe(true);
        expect(result.warning).toBe(false);
    });
});

describe('Matchmaking Logic - Expulsar Jugador', () => {

    test('El organizador puede expulsar a un jugador', () => {
        const result = kickPlayer(true, 'confirmed');
        expect(result.success).toBe(true);
        expect(result.newStatus).toBe('kicked');
    });

    test('Un jugador normal NO puede expulsar a otro', () => {
        const result = kickPlayer(false, 'confirmed');
        expect(result.success).toBe(false);
        expect(result.newStatus).toBe('confirmed');
    });
});