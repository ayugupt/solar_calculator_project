from azureml.core import Environment

service_env = Environment(name='service-env')
python_packages = ['tensorflow', 'pandas'] # whatever packages your entry script uses
for package in python_packages:
    service_env.python.conda_dependencies.add_pip_package(package)

from azureml.core.model import InferenceConfig

classifier_inference_config = InferenceConfig(source_directory = 'azure',
                                              entry_script="score.py",
                                              environment=service_env)

from azureml.core import Workspace

ws = Workspace.get(name='frt_machine',
                   subscription_id='234ac890-4c5f-4ee9-b636-a1e5757c4b87',
                   resource_group='frt')

from azureml.core.compute import ComputeTarget, AksCompute

# cluster_name = 'aks-cluster'
# compute_config = AksCompute.provisioning_configuration(location='eastus')
# production_cluster = ComputeTarget.create(ws, cluster_name, compute_config)
# production_cluster.wait_for_completion(show_output=True)

from azureml.core.webservice import AksWebservice, AciWebservice

classifier_deploy_config = AciWebservice.deploy_configuration(cpu_cores=2, memory_gb=1)
#classifier_deploy_config = AksWebservice.deploy_configuration()

from azureml.core.model import Model

model = ws.models['solar_irradiance_delhi']
service = Model.deploy(workspace=ws,
                       name = 'solar-irradiance-service',
                       models = [model],
                       inference_config = classifier_inference_config,
                       deployment_config = classifier_deploy_config,
                       )
service.wait_for_deployment(show_output = True)