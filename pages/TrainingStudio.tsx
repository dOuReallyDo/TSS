import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { ModelConfig, ModelType, TrainingParams, StoppingCriteria, StopCriterion, TrainingProgress } from '../types';
import { startTraining } from '../services/tradingDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Play, Square, Save, Construction, BrainCircuit } from 'lucide-react';

type Tab = 'Build' | 'Train' | 'Results';

const TrainingStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Build');
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    architecture: ModelType.LSTM,
    units1: 64,
    units2: 32,
    dropout: 0.2,
  });
  const [trainingParams, setTrainingParams] = useState<TrainingParams>({
    batchSize: 32,
    learningRate: 0.001,
  });
  const [stopCriteria, setStopCriteria] = useState<StoppingCriteria>({
    criterion: 'epoch',
    value: 100,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingProgress[]>([]);
  const [stopTraining, setStopTraining] = useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');


  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingHistory([]);
    setTrainingProgress(null);
    setSaveStatus(''); // Clear save status from previous runs
    const stopFn = startTraining(
      modelConfig,
      trainingParams,
      stopCriteria.criterion === 'epoch' ? stopCriteria.value : 1000, // Mock total epochs
      (progress) => {
        setTrainingProgress(progress);
        setTrainingHistory(prev => [...prev, progress]);
      },
      () => {
        setIsTraining(false);
        setStopTraining(null);
        setActiveTab('Results');
      }
    );
    setStopTraining(() => stopFn);
  };

  const handleStopTraining = () => {
    if (stopTraining) {
      stopTraining();
    }
    setIsTraining(false);
    setStopTraining(null);
  };

  const handleSaveModel = () => {
    setIsSaving(true);
    setSaveStatus('');
    console.log('Saving model with config:', modelConfig);
    // Simulate async save operation
    setTimeout(() => {
        setIsSaving(false);
        setSaveStatus(`Model '${modelConfig.architecture}_model.keras' saved successfully!`);
        // Clear the message after 5 seconds
        setTimeout(() => {
            setSaveStatus('');
        }, 5000);
    }, 1500);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopTraining) {
        stopTraining();
      }
    };
  }, [stopTraining]);

  const renderBuildTab = () => (
    <Card title="1. Build Model">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Architecture</label>
          <select 
            value={modelConfig.architecture}
            onChange={e => setModelConfig({...modelConfig, architecture: e.target.value as ModelType})}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white">
            {Object.values(ModelType).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Layer 1 Units</label>
          <input type="number" value={modelConfig.units1} onChange={e => setModelConfig({...modelConfig, units1: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Layer 2 Units</label>
          <input type="number" value={modelConfig.units2} onChange={e => setModelConfig({...modelConfig, units2: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Dropout (0.0 - 0.5)</label>
          <input type="number" step="0.1" min="0" max="0.5" value={modelConfig.dropout} onChange={e => setModelConfig({...modelConfig, dropout: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
      </div>
      <button onClick={() => setActiveTab('Train')} className="mt-6 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center justify-center">
        <BrainCircuit className="mr-2"/> Configure Training
      </button>
    </Card>
  );

  const renderTrainTab = () => (
    <Card title="2. Train Model">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
         <div>
          <label className="block text-sm font-medium text-gray-300">Batch Size</label>
          <input type="number" value={trainingParams.batchSize} onChange={e => setTrainingParams({...trainingParams, batchSize: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-300">Learning Rate</label>
          <input type="number" step="0.0001" value={trainingParams.learningRate} onChange={e => setTrainingParams({...trainingParams, learningRate: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300">Stopping Criterion</label>
             <select 
                value={stopCriteria.criterion}
                onChange={e => setStopCriteria({...stopCriteria, criterion: e.target.value as StopCriterion})}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white">
                <option value="epoch">Epoch-based</option>
                <option value="time">Time-based (minutes)</option>
                <option value="loss">Loss-based</option>
             </select>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-300">Value</label>
          <input type="number" value={stopCriteria.value} onChange={e => setStopCriteria({...stopCriteria, value: +e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"/>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button onClick={handleStartTraining} disabled={isTraining} className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white flex items-center justify-center disabled:bg-green-400">
            <Play className="mr-2"/> Start Training
        </button>
        <button onClick={handleStopTraining} disabled={!isTraining} className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white flex items-center justify-center disabled:bg-red-400">
            <Square className="mr-2"/> Stop Training
        </button>
      </div>

      {isTraining && trainingProgress && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-indigo-400 mb-2">Training Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
             <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${(trainingProgress.epoch / trainingProgress.totalEpochs) * 100}%` }}></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><p className="text-sm text-gray-400">Epoch</p><p className="text-xl font-bold">{trainingProgress.epoch}/{trainingProgress.totalEpochs}</p></div>
            <div><p className="text-sm text-gray-400">Loss</p><p className="text-xl font-bold">{trainingProgress.loss.toFixed(4)}</p></div>
            <div><p className="text-sm text-gray-400">Val Loss</p><p className="text-xl font-bold">{trainingProgress.valLoss.toFixed(4)}</p></div>
            <div><p className="text-sm text-gray-400">ETA</p><p className="text-xl font-bold">{trainingProgress.eta}</p></div>
          </div>
        </div>
      )}
    </Card>
  );
  
   const renderResultsTab = () => {
    if (trainingHistory.length === 0) {
      return (
        <Card title="3. Training Results">
          <p className="text-gray-400">No training results yet. Build and train a model first.</p>
        </Card>
      );
    }

    const lastEpoch = trainingHistory[trainingHistory.length - 1];
    const finalLoss = lastEpoch.loss.toFixed(4);
    const finalValLoss = lastEpoch.valLoss.toFixed(4);
    const lossGap = (lastEpoch.valLoss - lastEpoch.loss).toFixed(4);
    
    const gapData = trainingHistory.map(h => ({
        epoch: h.epoch,
        gap: h.valLoss - h.loss
    }));
    
    return (
        <Card title="3. Training Results & Analysis">
            <div className="space-y-8">
                {/* Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="!p-4 bg-gray-900"><p className="text-sm text-gray-400">Final Training Loss</p><p className="text-2xl font-bold">{finalLoss}</p></Card>
                    <Card className="!p-4 bg-gray-900"><p className="text-sm text-gray-400">Final Validation Loss</p><p className="text-2xl font-bold">{finalValLoss}</p></Card>
                    <Card className="!p-4 bg-gray-900"><p className="text-sm text-gray-400">Train-Val Loss Gap</p><p className="text-2xl font-bold">{lossGap}</p></Card>
                </div>
                
                {/* Main Loss Chart */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Loss vs. Validation Loss per Epoch</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trainingHistory} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="epoch" stroke="#A0AEC0" name="Epoch">
                           <Label value="Epoch" offset={-15} position="insideBottom" fill="#A0AEC0" />
                        </XAxis>
                        <YAxis stroke="#A0AEC0" domain={[0, 'auto']}>
                           <Label value="Loss" angle={-90} position="insideLeft" fill="#A0AEC0" style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                        <Line type="monotone" dataKey="loss" stroke="#8884d8" dot={false} name="Training Loss" />
                        <Line type="monotone" dataKey="valLoss" stroke="#82ca9d" dot={false} name="Validation Loss" />
                      </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Gap Chart */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Training-Validation Loss Gap</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={gapData} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                           <XAxis dataKey="epoch" stroke="#A0AEC0" name="Epoch">
                              <Label value="Epoch" offset={-15} position="insideBottom" fill="#A0AEC0" />
                           </XAxis>
                           <YAxis stroke="#A0AEC0" domain={['auto', 'auto']}>
                              <Label value="Gap" angle={-90} position="insideLeft" fill="#A0AEC0" style={{ textAnchor: 'middle' }} />
                           </YAxis>
                           <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                           <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                           <Line type="monotone" dataKey="gap" stroke="#f6ad55" dot={false} name="Loss Gap (Val - Train)" />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
                
                <div className="pt-6 border-t border-gray-700 flex items-center gap-4">
                    <button 
                        onClick={handleSaveModel} 
                        disabled={isSaving}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        <Save className="mr-2"/>
                        {isSaving ? 'Saving...' : 'Save Model'}
                    </button>
                    {saveStatus && <p className="text-sm text-green-400 animate-pulse">{saveStatus}</p>}
                </div>
            </div>
        </Card>
    );
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Training Studio</h1>
      <div className="flex border-b border-gray-700">
        {(['Build', 'Train', 'Results'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'Build' && renderBuildTab()}
        {activeTab === 'Train' && renderTrainTab()}
        {activeTab === 'Results' && renderResultsTab()}
      </div>
    </div>
  );
};

export default TrainingStudio;