import { MaterialLoader } from 'three';
import {
	NodeMaterial,
	LineBasicNodeMaterial,
	MeshBasicNodeMaterial,
	MeshStandardNodeMaterial,
	PointsNodeMaterial,
	SpriteNodeMaterial
} from '../materials/Materials.js';

class NodeMaterialLoader extends MaterialLoader {

	constructor( manager ) {

		super( manager );

		this.nodes = {};

	}

	parse( json ) {

		const material = super.parse( json );

		const nodes = this.nodes;
		const inputNodes = json.inputNodes;

		for ( const property in inputNodes ) {

			const uuid = inputNodes[ property ];

			material[ property ] = nodes[ uuid ];

		}

		return material;

	}

	setNodes( value ) {

		this.nodes = value;

		return this;

	}

	static createMaterialFromType( type ) {

		const materialLib = {
			NodeMaterial,
			LineBasicNodeMaterial,
			MeshBasicNodeMaterial,
			MeshStandardNodeMaterial,
			PointsNodeMaterial,
			SpriteNodeMaterial,
		};

		if ( materialLib[ type ] !== undefined ) {

			return new materialLib[ type ]();

		}

		return MaterialLoader.createMaterialFromType( type );

	}

}

export default NodeMaterialLoader;
