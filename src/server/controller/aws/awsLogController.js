import { CloudWatchLogsClient, DescribeLogGroupsCommand, DescribeLogStreamsCommand, GetLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const logGetter = async (req, res, next) => {

    console.log('logGetter middleware is hit');

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
        throw new Error('AWS credentials are not set in environment variables');        
    }

    //create the client
    const client = new CloudWatchLogsClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    // //create the input to get the log groups
    // var params = {
    //     accountIdentifiers: [
    //         process.env.AWS_ACCESS_KEY_ID,
    //         /* more items */
    //     ],
    //     includeLinkedAccounts: false,
    //     limit: '50',
    //     logGroupClass: STANDARD,
    //     nextToken: null
    // };

    // //get the log groups
    // try {
    //     await cloudwatchlogs.describeLogGroups(params, function (err, data) {
    //         if (err) console.log(err, err.stack); // an error occurred
    //         else console.log(data);           // successful response
    //     });
    // } catch (error) {
    //     console.log(error)
    // }
    // //create params to get log stream
    // var params = {
    //     descending: true,
    //     limit: '50',
    //     logGroupName: 'myNewFunction',
    //     nextToken: data.nextToken,
    //     orderBy: LastEventTime
    // };
    // //get the log stream
    // cloudwatchlogs.describeLogStreams(params, function (err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else console.log(data);           // successful response
    // });

    //get the actual logs
    const input = { // GetLogEventsRequest
        logGroupName: '/aws/lambda/heartwood-test-lambda-1',
        logStreamName: '2024/10/04/[$LATEST]fcfeaaaf6b474595ad46972119f59b37', // required
        startTime: Number(new Date(Date.now() - 24 * 60 * 60 * 1000)),
        endTime: Number(new Date()),
        nextToken: data.nextToken,
        limit: Number(50),
        startFromHead: true,
        unmask: false,
    };

    //run get log events
    const command = new GetLogEventsCommand(input);
    try {
        const response = await client.send(command);
        console.log('cloudwatch logs are:', response);
        res.locals.logsData = response.events;
        console.log('res locals logs data:', res.locals.logsData);
        next();
    } catch (error) {
        console.error('Error fetching logs', error);
        return next(error);
    }
}

module.export = logGetter;