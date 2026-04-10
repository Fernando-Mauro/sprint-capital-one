// utils/matchmaking.js

function canJoinReta(currentPlayers, maxPlayers, userSkill, retaSkill) {
    // Regla 1: Capacidad (Bloqueo fuerte)
    if (currentPlayers >= maxPlayers) {
        return { success: false, message: "La reta está llena." };
    }

    // Regla 3: Advertencia de nivel (No bloquea, pero avisa)
    if (userSkill === 'beginner' && retaSkill === 'advanced') {
        return {
            success: true,
            warning: true,
            message: "Advertencia: El nivel de esta reta es avanzado para tu perfil."
        };
    }

    // Camino Feliz
    return {
        success: true,
        warning: false,
        message: "Te has unido exitosamente a la reta."
    };
}

function kickPlayer(isOrganizer, targetPlayerStatus) {
    // Regla 2: Solo el organizador puede expulsar
    if (!isOrganizer) {
        return {
            success: false,
            newStatus: targetPlayerStatus,
            message: "No tienes permisos de organizador para expulsar."
        };
    }

    return {
        success: true,
        newStatus: 'kicked',
        message: "Jugador expulsado correctamente."
    };
}