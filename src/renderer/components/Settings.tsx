
import React, { createElement, useState } from 'react';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Credentials } from "../rendererTypes";

const Settings: React.FC = () => {
  // State to store user's input (whenever a user type something)
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
  
  const handleRegionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialInput({
      ...credentialInput,
      region: e.target.value,
    })
  };

  // Testing - Use useEffect to log the accessKey whenever it changes
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

  return (
    <div className="flex justify-center md:flex-wrap p-6 bg-white rounded-lg shadow-lg">
      <Form onSubmit={awsSubmit}>
        <Form.Group className="aws-1 bg-white" controlId="awsAccessKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Access Key</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="text" value={credentialInput.accessKey} onChange={handleAccessKeyInput} placeholder="Enter Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="secretKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Secret Key</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="text" value={credentialInput.maskedSecretAccessKey} onChange={handleSecretAccessKeyInput} placeholder="Enter Secret Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="region">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Region</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="region" value={credentialInput.region} onChange={handleRegionInput} placeholder="Enter Your Region" />
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
