## Domain
Domain objects, entities and value objects define the domain model. The domain also contains the events in the domain. 

## Use cases
Use cases contain the operations in the domain. They would be called in API endpoint handlers, for example.

[CreateUserUseCase](./src/modules/users/useCases/createUser/CreateUserUseCase.ts)   
[CreateOrganizationUseCase](./src/modules/users/useCases/createOrganization/CreateOrganizationUseCase.ts)   
[CreateTeamUseCase](./src/modules/teams/useCases/createTeam/CreateTeamUseCase.ts)   
[AddTeamMemberUseCase](./src/modules/users/useCases/addTeamMember/AddTeamMemberUseCase.ts)   

## (domain) Services
Operations that don't fit into domain objects could fit into a domain service.

For example: adding a member to a team. It would otherwise fit into the Team domain object, but limits in the Organization must to be enforced. Properies in the Organization need to be updated as well.

## DTOs
Data transfer objects. These are either inputs to use cases or domain object outputs that are exposed through request handlers, for example.

## Mappers
Domain objects are transformed from MongoDB documents to domain objects and back. If the domain object has a DTO then there's also a method to map the domain object to a DTO.

## Repos(itories)
Data access for domain objects. Has a specific interface for the domain object that the repository is for.

## infra(structure)
Database, http server stuff etc. Framework/library code.
