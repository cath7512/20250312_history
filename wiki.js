function loadWikipediaContent(eventId) {
    const wikiUrl = warData[eventId].wikipediaUrl;
    document.getElementById('wikipedia-frame').src = wikiUrl;
}

function syncWikipedia(dateStr, eventId) {
    const wikiContentMapping = warData[eventId].wikiContentMapping;
    const iframe = document.getElementById('wikipedia-frame');
    
    const sortedDates = Object.keys(wikiContentMapping).sort();
    let targetSection = null;
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
        if (sortedDates[i] <= dateStr) {
            targetSection = wikiContentMapping[sortedDates[i]];
            break;
        }
    }
    
    if (!targetSection && sortedDates.length > 0) {
        targetSection = wikiContentMapping[sortedDates[0]];
    }
    
    if (targetSection) {
        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument;
                const section = doc.querySelector(targetSection);
                if (section) {
                    // Remove previous highlights
                    doc.querySelectorAll('.highlight-active').forEach(el => 
                        el.classList.remove('highlight-active'));
                    
                    // Add new highlight
                    section.classList.add('highlight-active');
                    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (e) {
                console.log('Cannot access iframe content due to same-origin policy');
            }
        };
        iframe.src = warData[eventId].wikipediaUrl + targetSection;
    }
}
