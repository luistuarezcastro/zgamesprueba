export class EventoDeportivo {
  equipo1: string;
  equipo2: string;
  fecha: string;
  hora: string;
  cuotaEquipo1: number;
  cuotaEmpate: number;
  cuotaEquipo2: number;
  sportId: string; // Aquí agregas sportId

  constructor(data: any) {
    this.equipo1 = data.competitorHome?.competitorName?.en || 'Desconocido';  // Nombre del equipo 1
    this.equipo2 = data.competitorAway?.competitorName?.en || 'Desconocido';  // Nombre del equipo 2

    // Formateo de la fecha y hora
    const date = new Date(data.scheduled);
    this.fecha = date.toLocaleDateString();  // Fecha
    this.hora = date.toLocaleTimeString();   // Hora

    // Inicializar las cuotas con valores predeterminados en caso de que no se encuentren
    this.cuotaEquipo1 = 0;
    this.cuotaEmpate = 0;
    this.cuotaEquipo2 = 0;

    // Verificar si hay datos de mercados y cuotas
    if (data.markets && data.markets[0] && data.markets[0].marketLines) {
      const market = data.markets[0].marketLines[0];
      const outcomes = market.outcomes;

      // Asegurarse de que outcomes sea un arreglo
      if (Array.isArray(outcomes)) {
        // Buscar las cuotas correspondientes a los equipos y el empate
        const cuotaEquipo1 = outcomes.find(o => o.outcomeName?.en === this.equipo1);
        const cuotaEmpate = outcomes.find(o => o.outcomeName?.en === 'draw');
        const cuotaEquipo2 = outcomes.find(o => o.outcomeName?.en === this.equipo2);

        // Asignar las cuotas si se encontraron
        if (cuotaEquipo1) this.cuotaEquipo1 = cuotaEquipo1.odds || 0;
        if (cuotaEmpate) this.cuotaEmpate = cuotaEmpate.odds || 0;
        if (cuotaEquipo2) this.cuotaEquipo2 = cuotaEquipo2.odds || 0;
      }
    }

    // Asignación de sportId (esto depende de cómo se estructura tu objeto de datos)
    this.sportId = data.sportId || 'unknown'; // Asegúrate de que este dato esté presente en los datos
  }
}
