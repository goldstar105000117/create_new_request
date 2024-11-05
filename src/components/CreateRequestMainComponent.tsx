import React, { useState } from "react";
import { Button } from "flowbite-react";
import { HiPlus, HiX } from "react-icons/hi";

interface UrlInput {
  id: number;
  url: string;
  error?: string;
}

// Component specific props interface
type UrlInputComponentProps = {
  number: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onDelete?: () => void;
  showDelete?: boolean;
};

const UrlInputComponent: React.FC<UrlInputComponentProps> = ({ 
  number, 
  value, 
  error, 
  onChange, 
  onDelete, 
  showDelete = true 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Video/Folder URL {number}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g http://drive.google.com/some-link"
          className={`w-full px-4 py-2.5 rounded-lg border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          } focus:ring-1 focus:ring-blue-500 outline-none text-sm`}
        />
        {showDelete && (
          <button
            onClick={onDelete}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export function CreateRequestMainComponent() {
  const [inputs, setInputs] = useState<UrlInput[]>([{ id: 1, url: '' }]);

  const validateUrl = (url: string): string | undefined => {
    if (!url) return 'URL is required';
    if (!url.startsWith('http://drive.google.com/')) {
      return 'URL must start with http://drive.google.com/';
    }
    return undefined;
  };

  const handleAddInput = () => {
    if (inputs.length >= 10) return;
    const newId = Math.max(...inputs.map(i => i.id)) + 1;
    setInputs([...inputs, { id: newId, url: '' }]);
  };

  const handleRemoveInput = (id: number) => {
    if (inputs.length <= 1) return;
    setInputs(inputs.filter(input => input.id !== id));
  };

  const handleUrlChange = (id: number, url: string) => {
    setInputs(inputs.map(input => 
      input.id === id ? { ...input, url, error: undefined } : input
    ));
  };

  const handleSubmit = () => {
    const validatedInputs = inputs.map(input => ({
      ...input,
      error: validateUrl(input.url)
    }));

    setInputs(validatedInputs);

    if (validatedInputs.some(input => input.error)) {
      return;
    }

    const formattedData = inputs.map(input => ({
      url: input.url,
      value: input.url.split('/').pop() || ''
    }));

    alert(JSON.stringify(formattedData, null, 2));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b bg-white fixed top-0 left-0 right-0 z-10">
        <h3 className="text-lg font-semibold text-gray-900">
          Create New Request
        </h3>
        <button
          className="text-gray-400 hover:text-gray-600"
        >
          <HiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ marginTop: "73px", marginBottom: "73px" }}>
        <div className="mx-auto w-full max-w-[672px] px-6 py-8">
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900">
              Add videos or folders
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              These videos would be cut, labeled and made available in your
              Recharm video library
            </p>
          </div>

          <div className="space-y-4">
            {inputs.map((input, index) => (
              <UrlInputComponent
                key={input.id}
                number={index + 1}
                value={input.url}
                error={input.error}
                onChange={(url) => handleUrlChange(input.id, url)}
                onDelete={() => handleRemoveInput(input.id)}
                showDelete={inputs.length > 1}
              />
            ))}
          </div>

          {inputs.length < 10 && (
            <Button
              color="light"
              onClick={handleAddInput}
              className="mt-4 text-sm font-medium text-purple-800 bg-white hover:bg-gray-50 border border-gray-300"
            >
              <span className="flex items-center">
                <span className="bg-purple-800 rounded-full p-0.5 mr-2">
                  <HiPlus className="h-3 w-3 text-white" />
                </span>
                Add URL
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end z-10">
        <Button
          onClick={handleSubmit}
          className="text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white"
        >
          <HiPlus className="h-3 w-3 text-white mt-1 mr-2" />
          Create Request
        </Button>
      </div>
    </div>
  );
}