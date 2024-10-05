
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const Settings = () => {
  // State to store user's input (whenever a user type something)
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');

  // Function to handle user's input 
  const handleAccessKeyInput = (e) => {
    setAccessKey(e.target.value);
  };

  const handleSecretAccessKeyInput = (e) => {
    setSecretAccessKey(e.target.value);
  };
  const handleSecretAccessKeyInput = (e) => {
    setSecretAccessKey(e.target.value);
  };

  const handleRegionInput = (e) => {
    setRegion(e.target.value);
  };

  // Testing - Use useEffect to log the accessKey whenever it changes
  useEffect(() => {
    console.log('accessKey is', accessKey);
  }, [accessKey]);

  useEffect(() => {
    console.log('secretAccessKey is', secretAccessKey);
  }, [secretAccessKey]);

  useEffect(() => {
    console.log('region is', region);
  }, [region]);

  // Function to submit user credential (from state) and make a post request (useEffect)

  const awsSubmit = async (e) => {  // We should't pass user credential variable here. it should be from state. 
    e.preventDefault(); //prevent form submission

    try {
      const result = await window.api.addCredential(accessKey, secretAccessKey, region);
    } catch (error) {
      console.log('error in awsSubmit function');
    }
  }

  return (
    <div class="flex justify-center md:flex-wrap p-6 bg-white rounded-lg shadow-lg">
      <Form onSubmit={awsSubmit}>
        <Form.Group className="aws-1 bg-white" controlId="awsAccessKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Access Key</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="text" value={accessKey} onChange={handleAccessKeyInput} placeholder="Enter Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="secretKey">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Secret Key</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="text" value={secretAccessKey} onChange={handleSecretAccessKeyInput} placeholder="Enter Secret Access Key" />
        </Form.Group>

        <Form.Group className="aws-1 bg-white" controlId="region">
          <Form.Label class="text-md font-semibold mb-2 text-base-content">Region</Form.Label>
          <Form.Control className="input input-bordered mb-3" type="region" value={region} onChange={handleRegionInput} placeholder="Enter Your Region" />
        </Form.Group>

        <div class="flex justify-center space-y-4 mt-4">
          <button class="btn w-full rounded-md" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </div>
  )
};

export default Settings;
