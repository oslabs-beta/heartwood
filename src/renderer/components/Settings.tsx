
import React, { createElement, useState } from 'react';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Credentials } from "../rendererTypes";

const Settings: React.FC = () => {
  // State to store user's input 
  const [credentialInput, setCredentialInput] = useState<Credentials>({
    accessKey: '',
    secretAccessKey: '',
    maskedSecretAccessKey: '',
    region: '',
  });

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
    <div className="flex justify-center md:flex-wrap p-6 bg-white rounded-lg shadow-lg">
      <Form onSubmit={awsSubmit}>
        <Form.Group className="aws-1 bg-white" controlId="awsAccessKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Access Key</Form.Label>
          <Form.Control className="input input-bordered mb-3 w-full" type="text" value={credentialInput.accessKey} onChange={handleAccessKeyInput} placeholder="Enter Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="secretKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Secret Key</Form.Label>
          <Form.Control className="input input-bordered mb-3 w-full" type="text" value={credentialInput.maskedSecretAccessKey} onChange={handleSecretAccessKeyInput} placeholder="Enter Secret Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="region">
          <Form.Label className="text-md font-semibold mb-2 text-base-content">Region</Form.Label>
          <Form.Select
            className="select select-bordered mb-3 w-full"
            value={credentialInput.region}
            onChange={handleRegionInput}
          >
            <option value="">Select a region</option>
            {AWS_REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="flex justify-center space-y-4 mt-4">
          <button className="btn w-full rounded-md" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </div>
  )
};

export default Settings;
