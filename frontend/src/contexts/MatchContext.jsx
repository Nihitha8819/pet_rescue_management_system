import React, { createContext, useState, useEffect } from 'react';
import matchService from '../services/matchService';

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await matchService.getMatches();
                setMatches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const addMatch = async (matchData) => {
        try {
            const newMatch = await matchService.createMatch(matchData);
            setMatches((prevMatches) => [...prevMatches, newMatch]);
        } catch (err) {
            setError(err.message);
        }
    };

    const removeMatch = async (matchId) => {
        try {
            await matchService.deleteMatch(matchId);
            setMatches((prevMatches) => prevMatches.filter(match => match.id !== matchId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <MatchContext.Provider value={{ matches, loading, error, addMatch, removeMatch }}>
            {children}
        </MatchContext.Provider>
    );
};