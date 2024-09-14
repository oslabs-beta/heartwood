
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
        <div class="flex justify-center text-xl md:flex-wrap p-6 bg-gray-100 rounded-lg shadow-lg text-gray-900 dark:text-gray-900">
            <Form onSubmit={awsSubmit}>
                <Form.Group className="aws-1 mb-2 text-gray-900" controlId="awsAccessKey">
                    <Form.Label class="font-medium">Access Key</Form.Label>
                    <Form.Control type="text" value={accessKey} onChange={handleAccessKeyInput} placeholder="Enter Access Key" />
                </Form.Group>
 
                <Form.Group className="aws-1 mb-2" controlId="secretKey">
                    <Form.Label class="font-medium">Secret Key</Form.Label>
                    <Form.Control type="text" value={secretAccessKey} onChange={handleSecretAccessKeyInput} placeholder="Enter Secret Access Key" />
                </Form.Group>

                <Form.Group className="aws-1 mb-2" controlId="region">
                    <Form.Label class="font-medium">Region</Form.Label>
                    <Form.Control type="region" value={region} onChange={handleRegionInput} placeholder="Enter Your Region" />
                </Form.Group> 

                <div class="flex justify-center space-y-4 mt-4">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
                        Submit
                    </button>
                </div>
            </Form>
        </div>
    )
};

export default Settings;
