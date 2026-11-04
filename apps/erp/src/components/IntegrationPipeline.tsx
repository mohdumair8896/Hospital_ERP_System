import React from 'react';
import { useApiResource } from './analytics/useApiResource';
import { GATEWAY_STATUS_PATH, parseGatewayStatus } from './integration/gateway';
import { PipelineIllustration } from './integration/PipelineIllustration';
import { ServiceHealthPanel } from './integration/ServiceHealthPanel';

const POLL_SECONDS = 15;

/** Integration monitor: live gateway and service health, plus an illustrative HL7 / FHIR walkthrough. */
export default function IntegrationPipeline() {
  const health = useApiResource(GATEWAY_STATUS_PATH, parseGatewayStatus, { pollMs: POLL_SECONDS * 1000 });

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Integration monitor</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Health of the API gateway and the five backend services, and how clinical messages move between the patient website and the ERP.
        </p>
      </header>
      <ServiceHealthPanel health={health} pollSeconds={POLL_SECONDS} />
      <PipelineIllustration />
    </div>
  );
}
