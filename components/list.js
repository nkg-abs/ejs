import { React } from 'react';
import { map } from '@laufire/utils/collection';

const List = ({ source: items = [] }) => map(items, (item) => <li>{ item }</li>);

export default List;
