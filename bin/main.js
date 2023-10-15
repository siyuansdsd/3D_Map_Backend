import * as Cdk from 'aws-cdk-lib'
import { unitedCoder } from '../stacks/CRMStacks.js'

const app = new Cdk.App()
new unitedCoder(app, 'unitedCoder', {
    env: {
        region: 'ap-southeast-2',
        account: '216663584932',
      },
})
app.synth()