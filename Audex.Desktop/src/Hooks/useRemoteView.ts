import {
	DocumentNode,
	QueryHookOptions,
	useQuery,
	useSubscription,
	WatchQueryFetchPolicy,
} from '@apollo/client';
import { FieldNode, OperationDefinitionNode, SelectionSetNode } from 'graphql';
import { useEffect, useState } from 'react';

interface IUseRemoteViewProps {
	query: DocumentNode;
	subscription: DocumentNode;
	idField?: string;
	deletedOnField?: string;
	queryOptions?: QueryHookOptions;
}

type RemoteViewAction =
	| 'none'
	| 'firstFetch'
	| 'nextFetch'
	| 'rowAdd'
	| 'rowUpdate'
	| 'rowDelete';

const useRemoteView = <T>(p: IUseRemoteViewProps) => {
	const [dataset, setDataset] = useState<Array<T>>([]);
	const [isMore, setIsMore] = useState<boolean>(false);
	const [nextCursor, setNextCursor] = useState<string>();
	const [lastEvent, setLastEvent] = useState<RemoteViewAction>('none');
	const { data, loading, error, refetch } = useQuery(p.query, p.queryOptions);
	const onSubscriptionUpdate = useSubscription(p.subscription, {});

	// A function the user can call to get the
	// next "page" of results
	const next = () => {
		setLastEvent('nextFetch');
		refetch({ cursor: nextCursor });
	};
	// Executes when data is retrieved first and
	// next pages
	useEffect(() => {
		if (!data) return;

		if (lastEvent == 'none') setLastEvent('firstFetch');

		// Get root by extracting the name of
		// the root from the passed DocumentNode
		const root = data[getQueryRoot(p.query)];

		// Append fetched nodes to current dataset
		const nodes = root.nodes as Array<T>;
		setDataset([...dataset, ...nodes]);

		// Set pagination info if available
		if (root.pageInfo) {
			if (root.pageInfo.hasNextPage != null)
				setIsMore(root.pageInfo.hasNextPage);
			if (root.pageInfo.endCursor) setNextCursor(root.pageInfo.endCursor);
		}
	}, [data]);

	useEffect(() => {
		if (!onSubscriptionUpdate.data) return;

		// Gets the array of changed entities by query root
		const changedEntities = onSubscriptionUpdate.data[
			getQueryRoot(p.subscription)
		] as Array<T>;

		// Get field names to check for additions, updates
		// and deletions
		const idField = p.idField ?? 'id';
		const deletedOnField = p.deletedOnField ?? 'deletedOn';

		// Getting an array of ids in the current dataset
		const currentIds: string[] = (dataset as Array<any>).map(
			(e) => e[idField]
		);

		// Copying the dataset to a new working variable
		let newDataset = [...dataset];

		// For each changed entity
		for (let x = 0; x < changedEntities.length; x++) {
			const entity = changedEntities[x] as any;

			// If id exists in dataset
			if (currentIds.includes(entity[idField])) {
				//  Then check if DeletedOn is set => Remove by id
				if (entity[deletedOnField] != null) {
					newDataset = (newDataset as any).filter(
						(e: any) => e[idField] != entity[idField]
					);
					setLastEvent('rowDelete');
				}
				//  Else => Replace entity by id
				else {
					const index = newDataset.indexOf(
						newDataset.find(
							(e: any) => e[idField] == entity[idField]
						)!
					);
					newDataset[index] = entity;
					setLastEvent('rowUpdate');
				}
			}
			// Else => Add entity to "top of list"
			else {
				newDataset.unshift(entity);
				setLastEvent('rowAdd');
			}
		}

		// Set dataset as working dataset
		setDataset(newDataset);
	}, [onSubscriptionUpdate.data]);

	return { dataset, loading, error, lastEvent, isMore, next };
};

// Object path found through console.log(query)
const getQueryRoot = (q: DocumentNode) => {
	return (
		(
			(q.definitions[0] as OperationDefinitionNode)
				.selectionSet as SelectionSetNode
		).selections[0] as FieldNode
	).name.value;
};

export default useRemoteView;
