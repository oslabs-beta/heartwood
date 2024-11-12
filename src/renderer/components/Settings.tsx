
import React, { createElement, useState, useEffect } from 'react';
import { Credentials } from "../rendererTypes";

const Settings: React.FC = () => {
  // State to store user's input 
  const [credentialInput, setCredentialInput] = useState<Credentials>({
    accessKey: '',
    secretAccessKey: '',
    maskedSecretAccessKey: '',
    region: '',
  });

  // State to store user details
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: 'user@example.com', // fetch this from db?
    newPassword: '',
    confirmPassword: '',
  })
  // Function to handle user's input 
  const handleAccessKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialInput({
      ...credentialInput,
      accessKey: e.target.value,
    })
  };

  const handleSecretAccessKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialInput({
      ...credentialInput,
      secretAccessKey: e.target.value,
      maskedSecretAccessKey: ('*'.repeat(e.target.value.length)),
    })
  };

  const handleRegionInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCredentialInput({
      ...credentialInput,
      region: e.target.value,
    })
  };

  // // Testing - Use useEffect to log the accessKey whenever it changes
  useEffect(() => {
    console.log('accessKey is', credentialInput.accessKey);
  }, [credentialInput.accessKey]);

  useEffect(() => {
    console.log('secretAccessKey is', credentialInput.secretAccessKey);
  }, [credentialInput.secretAccessKey]);

  useEffect(() => {
    console.log('region is', credentialInput.region);
  }, [credentialInput.region]);

  // Function to submit user credential (from state) and make a post request (useEffect)
  const awsSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const result = await window.api.addCredential(credentialInput.accessKey, credentialInput.secretAccessKey, credentialInput.region);
      setCredentialInput({
        accessKey: '',
        secretAccessKey: '',
        maskedSecretAccessKey: '',
        region: '',
      });
    } catch (error) {
      console.log('error in awsSubmit function');
    }
  }

  const AWS_REGIONS = [
    { value: 'us-east-1', label: 'US East 1 (N. Virginia)' },
    { value: 'us-east-2', label: 'US East 2 (Ohio)' },
    { value: 'us-west-1', label: 'US West 1 (N. California)' },
    { value: 'us-west-2', label: 'US West 2 (Oregon)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
    { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
    { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
    { value: 'ca-central-1', label: 'Canada (Central)' },
    { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'eu-west-2', label: 'Europe (London)' },
    { value: 'eu-west-3', label: 'Europe (Paris)' }
  ];

  return (
    <div className="flex justify-center items-center h-screen p-6 bg-base-200">
      <form onSubmit={awsSubmit} className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg">
        <div className="form-control">
          <label className="label text-base-content font-semibold">Access Key</label>
          <input
            type="text"
            className="input input-bordered mb-3"
            value={credentialInput.accessKey}
            onChange={handleAccessKeyInput}
            placeholder="Enter Access Key"
          />
        </div>

        <div className="form-control">
          <label className="label text-base-content font-semibold">Secret Key</label>
          <input
            type="text"
            className="input input-bordered mb-3"
            value={credentialInput.maskedSecretAccessKey}
            onChange={handleSecretAccessKeyInput}
            placeholder="Enter Secret Access Key"
          />
        </div>

        <div className="form-control">
          <label className="label text-base-content font-semibold">Region</label>
          <select
            className="select select-bordered mb-3"
            value={credentialInput.region}
            onChange={handleRegionInput}
          >
            <option value="">Select a region</option>
            {AWS_REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mt-4">
          <button className="btn btn-primary w-full" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;