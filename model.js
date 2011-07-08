module.exports = {
  lists: {
    bus_lines: [
      { area: 'Transcarioca', previous_number: '750', current_number: '550', itinerary: 'Cidade de Deus - Gávea', extras: [] }
      , { area: 'Transcarioca', previous_number: '750', current_number: '354', itinerary: 'Cidade de Deus - Praça XV', extras: [] }
      , { area: 'Transcarioca', previous_number: '751', current_number: '862', itinerary: 'Rio das Pedras - Barra da Tijuca (via Estr. de Jacarepaguá)', extras: ['Circular'] }
    ]
  },
  
  bus_lines: {
    find_all: function(){
      return module.exports.lists.bus_lines;
    }
  }
  
};
