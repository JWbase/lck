"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DraftSimulator = () => {
  const TEAM_CAPTAINS = {
    TOP: { name: 'KIIN', team: null },
    JGL: { name: 'PEANUT', team: null },
    MID: { name: 'FAKER', team: null },
    BOT: { name: 'GUMAYUSI', team: null },
    SPT: { name: 'DELIGHT', team: null }
  };
  
  const PLAYERS = {
    TOP: [
      { name: 'Doran', team: 'T1' },
      { name: 'Zeus', team: 'HLE' },
      { name: 'Siwoo', team: 'DK' },
      { name: 'Clear', team: 'FOX' },
      { name: 'Rich', team: 'DRX' },
      { name: 'Kingen', team: 'NS' },
      { name: 'DuDu', team: 'KDF' },
      { name: 'Morgan', team: 'BRO' },
      { name: 'PerfecT', team: 'KT' }
    ],
    JGL: [
      { name: 'Oner', team: 'T1' },
      { name: 'Canyon', team: 'GEN.G' },
      { name: 'Lucid', team: 'DK' },
      { name: 'Raptor', team: 'FOX' },
      { name: 'Juhan/Sponge', team: 'DRX' },
      { name: 'Sylvie', team: 'NS' },
      { name: 'Pyosik', team: 'KDF' },
      { name: 'Hambak', team: 'BRO' },
      { name: 'Cuzz', team: 'KT' }
    ],
    MID: [
      { name: 'Chovy', team: 'GEN.G' },
      { name: 'Zeka', team: 'HLE' },
      { name: 'ShowMaker', team: 'DK' },
      { name: 'VicLa', team: 'FOX' },
      { name: 'ucal', team: 'DRX' },
      { name: 'Fisher', team: 'NS' },
      { name: 'BuLLDoG', team: 'KDF' },
      { name: 'Clozer', team: 'BRO' },
      { name: 'Bdd', team: 'KT' }
    ],
    BOT: [
      { name: 'Ruler', team: 'GEN.G' },
      { name: 'Viper', team: 'HLE' },
      { name: 'Aiming', team: 'DK' },
      { name: 'Diable', team: 'FOX' },
      { name: 'Teddy', team: 'DRX' },
      { name: 'Jiwoo', team: 'NS' },
      { name: 'Berserker', team: 'KDF' },
      { name: 'Hype', team: 'BRO' },
      { name: 'deokdam', team: 'KT' }
    ],
    SPT: [
      { name: 'Keria', team: 'T1' },
      { name: 'Duro', team: 'GEN.G' },
      { name: 'BeryL', team: 'DK' },
      { name: 'Kellin', team: 'FOX' },
      { name: 'Andil', team: 'DRX' },
      { name: 'Lehends', team: 'NS' },
      { name: 'Life', team: 'KDF' },
      { name: 'Pollu', team: 'BRO' },
      { name: 'Way', team: 'KT' }
    ]
  };

  const [round, setRound] = useState(1);
  const [currentPick, setCurrentPick] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState({
    TOP: [],
    JGL: [],
    MID: [],
    BOT: [],
    SPT: []
  });
  const [roundTeams, setRoundTeams] = useState(new Set());
  const [isDraftComplete, setIsDraftComplete] = useState(false);

  const getCurrentRole = () => {
    const round1Order = ['SPT', 'JGL', 'TOP', 'MID', 'BOT', 'BOT', 'MID', 'TOP', 'JGL', 'SPT'];
    const round2Order = ['BOT', 'MID', 'TOP', 'JGL', 'SPT', 'SPT', 'JGL', 'TOP', 'MID', 'BOT'];
    const pickOrder = round === 1 ? round1Order : round2Order;
    return pickOrder[(currentPick - 1) % 10];
  };

  const isPlayerSelectable = (role, player) => {
    if (selectedPlayers[role].length >= 4) return false;
    return !roundTeams.has(player.team);
  };

  const handlePlayerSelect = (role, player) => {
    if (isDraftComplete) return;
    
    if (!isPlayerSelectable(role, player)) {
      if (selectedPlayers[role].length >= 4) {
        alert('이미 해당 포지션의 선수를 모두 선택했습니다.');
      } else {
        alert('같은 라운드에서 같은 팀의 선수를 선택할 수 없습니다.');
      }
      return;
    }

    setSelectedPlayers(prev => ({
      ...prev,
      [role]: [...prev[role], { ...player, pick: currentPick, round }]
    }));

    setRoundTeams(prev => new Set([...prev, player.team]));

    if (currentPick % 10 === 0) {
      setRound(prev => prev + 1);
      setRoundTeams(new Set());
    }
    
    const newTotalPicks = getTotalPicks() + 1;
    if (newTotalPicks === 20) {
      setIsDraftComplete(true);
    }
    setCurrentPick(prev => prev + 1);
  };

  const getTotalPicks = () => {
    return Object.values(selectedPlayers).reduce((sum, players) => sum + players.length, 0);
  };

  const getFinalRoster = () => {
    return Object.entries(TEAM_CAPTAINS).map(([role, captain]) => ({
      role,
      captain: captain.name,
      players: selectedPlayers[role].map(player => ({
        name: player.name,
        team: player.team,
        pick: player.pick,
        round: player.round
      }))
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          LCK Draft Simulator - {isDraftComplete ? "Draft Complete!" : `Round ${round} (Pick ${currentPick % 10 || 10}/10)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isDraftComplete ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">최종 로스터</h2>
            <div className="grid grid-cols-5 gap-4">
              {getFinalRoster().map(({ role, captain, players }) => (
                <div key={role} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{role}</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-blue-600">팀장: {captain}</p>
                    <p className="font-medium">선수:</p>
                    {players.map((player, idx) => (
                      <p key={idx} className="text-sm">
                        {player.name} ({player.team})
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(TEAM_CAPTAINS).map(([role, captain]) => (
              <div key={role} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{role}</h3>
                <p className="font-semibold text-blue-600 mb-2">팀장: {captain.name}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">선택된 선수 ({selectedPlayers[role].length}/4):</h4>
                  {selectedPlayers[role].map(({ name, team, pick, round }) => (
                    <p key={name} className="text-sm">
                      R{round}-{pick % 10 || 10}. {name} ({team})
                    </p>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">가능한 선수:</h4>
                  {PLAYERS[role]
                    .filter(player => !selectedPlayers[role].some(selected => selected.name === player.name))
                    .map(player => (
                      <button
                        key={player.name}
                        onClick={() => handlePlayerSelect(role, player)}
                        disabled={getCurrentRole() !== role || !isPlayerSelectable(role, player)}
                        className={`w-full text-left px-2 py-1 rounded text-sm mb-1 
                          ${getCurrentRole() === role && isPlayerSelectable(role, player)
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700'}`}
                      >
                        {player.name} ({player.team})
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraftSimulator;