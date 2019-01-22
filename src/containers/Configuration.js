const Configuration = {
  run_statuses: {
    1: 'SUBMITTED',
    2: 'RUNNING',
    3: 'PROCESSING RESULTS',
    4: 'COMPLETED',
    5: 'ERROR'
  },
  api: {
    version: 'v1'
  },
  vulnerabilityBands: {
    low: 0.8,
    medium: 1,
    high: null // infinite
    /*       low: 0.005,
      medium: 0.01,
      high: null // infinite */
  },
  filtered_assets: ['meter', 'overhead_line', 'pole'],
  vulnerability_measurement: 'vulnerability',
  criticalVulnerability: 1,
  // The substation has to be mapped here
  selectionMappings: {
    substation_meter: 'node_14', // Asset List to Network Topology
    node_14: 'substation_meter' // Network Topology to Asset List
  },
  defaultFirstAssetSelected: 'substation_meter',
  defaultFirstMetricSelected: 'measured_real_power',
  defaultMetricClasses: [
    {
      class: 'meter',
      recording: 'measured_real_power'
    },
    {
      class: 'triplex-meter',
      recording: 'measured_real_power'
    },
    {
      class: 'transformer',
      recording: 'measured_real_power'
    },
    {
      class: 'substation',
      recording: 'measured_real_power'
    },
    {
      class: 'substation_meter',
      recording: 'measured_real_power'
    },
    {
      class: 'pole',
      recording: 'pole_stress'
    },
    {
      class: 'weather',
      recording: 'wind_speed'
    },
    {
      class: 'line',
      recording: 'power_out_real'
    }
  ],
  primaryMetricsForClasses: [
    {
      class: 'pole',
      properties: [
        {
          key: 'resisting_moment'
        },
        {
          key: 'total_moment'
        },
        {
          key: 'susceptibility'
        },
        {
          key: 'wind_speed'
        }
      ]
    },
    {
      class: 'line',
      properties: [
        {
          key: 'power_out___real'
        },
        {
          key: 'power_in___real'
        },
        {
          key: 'wind_speed'
        }
      ]
    },
    {
      class: 'overhead_line',
      properties: [
        {
          key: 'power_out___real'
        },
        {
          key: 'power_in___real'
        },
        {
          key: 'wind_speed'
        }
      ]
    },
    {
      class: 'underground_line',
      properties: [
        {
          key: 'power_out___real'
        },
        {
          key: 'power_in___real'
        },
        {
          key: 'wind_speed'
        }
      ]
    },
    {
      class: 'substation_meter',
      properties: [
        {
          key: 'measured_reactive_power'
        },
        {
          key: 'measured_real_power'
        },
        {
          key: 'wind_speed'
        }
      ]
    },
    {
      class: 'meter',
      properties: [
        {
          key: 'measured_reactive_power'
        },
        {
          key: 'measured_real_power'
        },
        {
          key: 'wind_speed'
        }
      ]
    }
  ],
  primaryPropertiesForClasses: [
    {
      class: 'meter',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'nominal_voltage',
          name: 'Nominal Voltage'
        },
        {
          key: 'bustype',
          name: 'Bus Type'
        },
        {
          key: 'class',
          name: 'class'
        },
        {
          key: 'phases',
          name: 'Phases'
        },
        {
          key: 'service_status',
          name: 'Service Status'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        }
      ]
    },
    {
      class: 'triplex-meter',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'nominal_voltage',
          name: 'Nominal Voltage'
        },
        {
          key: 'bustype',
          name: 'Bus Type'
        },
        {
          key: 'class',
          name: 'class'
        },
        {
          key: 'phases',
          name: 'Phases'
        },
        {
          key: 'service_status',
          name: 'Service Status'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        }
      ]
    },
    {
      class: 'transformer',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'nominal_voltage',
          name: 'Nominal Voltage'
        },
        {
          key: 'bustype',
          name: 'Bus Type'
        },
        {
          key: 'class',
          name: 'class'
        },
        {
          key: 'phases',
          name: 'Phases'
        },
        {
          key: 'service_status',
          name: 'Service Status'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        }
      ]
    },
    {
      class: 'substation',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'nominal_voltage',
          name: 'Nominal Voltage'
        },
        {
          key: 'bustype',
          name: 'Bus Type'
        },
        {
          key: 'class',
          name: 'class'
        },
        {
          key: 'phases',
          name: 'Phases'
        },
        {
          key: 'service_status',
          name: 'Service Status'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        }
      ]
    },
    {
      class: 'substation_meter',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'nominal_voltage',
          name: 'Nominal Voltage'
        },
        {
          key: 'bustype',
          name: 'Bus Type'
        },
        {
          key: 'class',
          name: 'class'
        },
        {
          key: 'phases',
          name: 'Phases'
        },
        {
          key: 'service_status',
          name: 'Service Status'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        }
      ]
    },
    {
      class: 'pole',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'class',
          name: 'Class'
        },
        {
          key: 'pole_type',
          name: 'Type'
        },
        {
          key: 'equipment_height',
          name: 'Height'
        },
        {
          key: 'equipment_area',
          name: 'Area'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'tilt_angle',
          name: 'Tilt Angel'
        },
        {
          key: 'tilt_direction',
          name: 'Tilt Direction'
        }
      ]
    },
    {
      class: 'weather',
      properties: []
    },
    {
      class: 'line',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'configuration',
          name: 'Configurration'
        },
        {
          key: 'class',
          name: 'Class'
        },
        {
          key: 'continuous_rating',
          name: 'Continuous Rating'
        },
        {
          key: 'emergency_rating',
          name: 'Emergency Rating'
        },
        {
          key: 'flow_direction',
          name: 'Flow Direction'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        },
        {
          key: 'length',
          name: 'Length'
        }
      ]
    },
    {
      class: 'overhead_line',
      properties: [
        {
          key: 'Name',
          name: 'Name'
        },
        {
          key: 'configuration',
          name: 'Configurration'
        },
        {
          key: 'class',
          name: 'Class'
        },
        {
          key: 'continuous_rating',
          name: 'Continuous Rating'
        },
        {
          key: 'emergency_rating',
          name: 'Emergency Rating'
        },
        {
          key: 'flow_direction',
          name: 'Flow Direction'
        },
        {
          key: 'longitude',
          name: 'Longitude'
        },
        {
          key: 'latitude',
          name: 'Latitude'
        },
        {
          key: 'length',
          name: 'Length'
        }
      ]
    }
  ],
  globalRecordings: [
    {
      id: 10000,
      is_measure: true,
      name: 'wind_speed',
      asset: 'weather',
      fullName: 'weather__wind_speed'
    }
  ],
  recordingLabels: [
    {
      name: 'vulnerability',
      label: 'Peak Vulnerability',
      YAxisPosition: 'left'
    },
    {
      name: 'pole_stress',
      nameAlias: 'vulnerability_index',
      label: 'Vulnerability Index',
      YAxisPosition: 'left'
    },
    {
      name: 'critical_pole_stress',
      nameAlias: 'critical_vulnerability_index',
      label: 'Critical Vulnerability Index',
      unit: 'pu',
      YAxisPosition: 'left'
    },
    {
      name: 'power_out___real',
      label: 'Power Out Real',
      unit: 'W',
      YAxisPosition: 'left'
    },
    {
      name: 'power_out_real',
      label: 'Power Out Real',
      unit: 'W',
      YAxisPosition: 'left'
    },
    {
      name: 'power_in___real',
      label: 'Power In Real',
      unit: 'W',
      YAxisPosition: 'right'
    },
    {
      name: 'measured_real_power',
      label: 'Measured Real Power',
      unit: 'W',
      YAxisPosition: 'right'
    },
    {
      name: 'measured_real_power',
      label: 'Measured Real Power',
      unit: 'W',
      YAxisPosition: 'left'
    },
    {
      name: 'measured_real_power',
      label: 'Measured Real Power',
      unit: 'W',
      YAxisPosition: 'right'
    },
    {
      name: 'measured_reactive_power',
      label: 'Measured Reactive Power',
      unit: 'W',
      YAxisPosition: 'right'
    },
    {
      name: 'wind_speed',
      label: 'Wind Speed',
      unit: 'meters/sec',
      YAxisPosition: 'right'
    },
    {
      name: 'resisting_moment',
      label: 'Resisting Moment',
      unit: 'ft*lb',
      YAxisPosition: 'right'
    },
    {
      name: 'total_moment',
      label: 'Total Moment',
      unit: 'ft*lb',
      YAxisPosition: 'right'
    },
    {
      name: 'critical_wind_speed',
      label: 'Critical Wind Speed',
      unit: 'meters/sec',
      YAxisPosition: 'right'
    },
    {
      name: 'susceptibility',
      label: 'Susceptibility',
      unit: 'pu*s/m',
      YAxisPosition: 'right'
    },
    {
      name: 'pole_status',
      label: 'Pole Status',
      unit: 'OK/FAILED',
      YAxisPosition: 'right'
    },
    {
      name: 'current_uptime',
      label: 'Current Uptime',
      unit: 'Minutes',
      YAxisPosition: 'right'
    },
    {
      name: 'power_out_real',
      label: 'Power Out Real',
      unit: 'W',
      YAxisPosition: 'right'
    }
  ]
};

export default Configuration;
