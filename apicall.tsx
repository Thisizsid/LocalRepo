// ── Initial load: all mahadashas + antardashas, no filters ──
const handleCalculateDasha = async () => {
    if (!validate()) return;
    setIsLoadingDasha(true);
    try {
        const body = {
            ...buildRequestBody(),
            max_level: 2,
            // No filter_maha_id / filter_antar_id here
        };

        const response = await fetch('https://kundali.suvajyotish.com/dashas', {
            method: 'POST',
            headers: { accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const data: DashaResponse = await response.json();
        navigation.navigate('Main', {
            screen: 'Dasha Prediction',
            params: { dashaData: data, birthData: buildRequestBody() }
        });
    } catch (error: any) {
        Alert.alert(t('kundali.error'), error?.message || 'Failed to fetch dasha data');
    } finally {
        setIsLoadingDasha(false);
    }
};

// ── Lazy load pratyantar when user taps an antardasha ──
const fetchPratyantar = async (
    birthData: any,
    mahaId: number,
    antarId: number
): Promise<PratyantarDasha[]> => {
    const body = {
        ...birthData,
        max_level: 4,          // get all 4 levels
        filter_maha_id: mahaId,
        filter_antar_id: antarId,
    };
    const res = await fetch('https://kundali.suvajyotish.com/dashas', {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    // Drill into the one matching antardasha
    const maha = data.vimshottari?.mahadashas?.find((m: Mahadasha) => m.planet_id === mahaId);
    const antar = maha?.antardashas?.find((a: Antardasha) => a.planet_id === antarId);
    return antar?.pratyantar_dashas ?? [];
};
