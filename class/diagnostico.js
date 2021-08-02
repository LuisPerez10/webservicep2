promedioSi = (data) => {
    let si = 0;
    let no = 0;
    let c = 0;
    Object.keys(data).forEach(ele => {
        let res = data[ele].toUpperCase();
        if (res == 'SI') {
            si++;
            c++;
        } else if (res == 'NO') {
            c++;
        };
    });

    return ((si / c) * 100);
}

respuestaDiagnostico = (data) => {
    let prob = promedioSi(data);
    if (prob > 80) {
        return "La COVID-19 se presenta como una enfermedade aguda, por lo tanto los síntomas que presenta en este momento podrían deberse a otra causa diferente del nuevo coronavirus.\n ¿Quiere solicitar una cita en su centro de salud para que valoren sus síntomas.?"
    } else if (prob > 50) {
        return "Los sintomas que presenta no son contundente por lo tanto debe permanecer en su casa durante los 7 días que dura una cuarentena evitando los contactos con otras personas \n ¿Quiere solicitar una cita en su centro de salud para que valoren sus síntomas.?"
    } else if (prob >= 0) {
        return "En este momento su situación no requiere asistencia sanitaria. Recuerde seguir manteniendo las recomendaciones generales de distanciamiento social, higiene y protección recomendadas."
    }
}

module.exports = {
    promedioSi,
    respuestaDiagnostico
}