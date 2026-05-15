// ── DashaTree: show all 3 systems via tabs ──
const DashaTree: React.FC<{ dashaData: DashaResponse; birthYear: number; birthData: any }> = ({
    dashaData, birthYear, birthData
}) => {
    const [activeTab, setActiveTab] = useState<'vimshottari' | 'tribhagi' | 'yogini'>('vimshottari');
    const [expandedMaha, setExpandedMaha] = useState<number | null>(null);
    const [expandedAntar, setExpandedAntar] = useState<string | null>(null);
    const [pratyantarCache, setPratyantarCache] = useState<Record<string, PratyantarDasha[]>>({});
    const [loadingAntar, setLoadingAntar] = useState<string | null>(null);

    const systemData = dashaData[activeTab];
    const mahadashas: Mahadasha[] = systemData?.mahadashas ?? [];

    const handleAntarPress = async (antarKey: string, mahaId: number, antarId: number) => {
        if (expandedAntar === antarKey) {
            setExpandedAntar(null);
            return;
        }
        setExpandedAntar(antarKey);

        // Only fetch if not already cached
        if (!pratyantarCache[antarKey]) {
            setLoadingAntar(antarKey);
            try {
                const pratyList = await fetchPratyantar(birthData, mahaId, antarId);
                setPratyantarCache(prev => ({ ...prev, [antarKey]: pratyList }));
            } catch { /* ignore */ } finally {
                setLoadingAntar(null);
            }
        }
    };

    return (
        <View>
            {/* Tab bar: Vimshottari | Tribhagi | Yogini */}
            <View style={treeStyles.tabBar}>
                {(['vimshottari', 'tribhagi', 'yogini'] as const).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[treeStyles.tab, activeTab === tab && treeStyles.tabActive]}
                        onPress={() => { setActiveTab(tab); setExpandedMaha(null); setExpandedAntar(null); }}
                    >
                        <Text style={[treeStyles.tabText, activeTab === tab && treeStyles.tabTextActive]}>
                            {tab === 'vimshottari' ? 'विंशोत्तरी' : tab === 'tribhagi' ? 'त्रिभागी' : 'योगिनी'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Balance (only vimshottari and tribhagi have it) */}
            {'dasha_balance' in systemData && (
                <Text style={treeStyles.balance}>
                    दशा बाँकी: {(systemData as any).dasha_balance}
                </Text>
            )}

            {/* Mahadasha list */}
            {mahadashas.map((maha, mi) => {
                const mahaOpen = expandedMaha === mi;
                const color = PLANET_COLORS[maha.planet_id] ?? '#888';
                const mahaEnd = mahadashas[mi + 1] ? formatDate(mahadashas[mi + 1].start_date) : '—';

                return (
                    <View key={mi} style={treeStyles.mahaBlock}>
                        <TouchableOpacity
                            style={treeStyles.compactRow}
                            onPress={() => { setExpandedMaha(mahaOpen ? null : mi); setExpandedAntar(null); }}
                            activeOpacity={0.7}
                        >
                            <Text style={treeStyles.compactLabel}>महादशा</Text>
                            <Text style={[treeStyles.compactPlanet, { color }]}>{maha.planet}</Text>
                            <Text style={treeStyles.compactDate}>{formatDate(maha.start_date)}</Text>
                            <Text style={treeStyles.compactDate}>{mahaEnd}</Text>
                            <Text style={[treeStyles.chevron, mahaOpen && treeStyles.chevronOpen]}>›</Text>
                        </TouchableOpacity>

                        {mahaOpen && maha.antardashas?.map((antar, ai) => {
                            const antarKey = `${mi}-${ai}`;
                            const antarOpen = expandedAntar === antarKey;
                            const antarColor = PLANET_COLORS[antar.planet_id] ?? '#888';
                            const antars = maha.antardashas!;
                            const antarEnd = antars[ai + 1] ? formatDate(antars[ai + 1].start_date) : mahaEnd;
                            const pratyList = pratyantarCache[antarKey];

                            return (
                                <View key={ai} style={treeStyles.antarItem}>
                                    <TouchableOpacity
                                        style={treeStyles.compactRowAntar}
                                        onPress={() => handleAntarPress(antarKey, maha.planet_id, antar.planet_id)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={treeStyles.compactLabel}>अन्तर्दशा</Text>
                                        <Text style={[treeStyles.compactPlanet, { color: antarColor }]}>{antar.planet}</Text>
                                        <Text style={treeStyles.compactDate}>{formatDate(antar.start_date)}</Text>
                                        <Text style={treeStyles.compactDate}>{antarEnd}</Text>
                                        {loadingAntar === antarKey
                                            ? <ActivityIndicator size="small" />
                                            : <Text style={[treeStyles.chevron, antarOpen && treeStyles.chevronOpen]}>›</Text>
                                        }
                                    </TouchableOpacity>

                                    {antarOpen && pratyList && (
                                        <DashaTableSection
                                            rows={pratyList.map((p, pi) => ({
                                                planet: p.planet,
                                                planet_id: p.planet_id,
                                                start_date: formatDate(p.start_date),
                                                end_date: pratyList[pi + 1]
                                                    ? formatDate(pratyList[pi + 1].start_date)
                                                    : antarEnd,
                                                age: getAge(birthYear, p.start_date),
                                            }))}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};
