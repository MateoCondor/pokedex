import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardText, Badge, Progress } from 'reactstrap';
import axios from 'axios';
import PokeTarjeta from '../Components/PokeTarjeta';

const Detalle = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState({});
    const [especie, setEspecie] = useState({});
    const [habitat, setHabitat] = useState('Desconocido');
    const [descripcion, setDescripcion] = useState([]);
    const [imagen, setImagen] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const [evoluciones, setEvoluciones] = useState([]);
    const [listaEvoluciones, setListaEvoluciones] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [cardClass, setCardClass] = useState('d-none');
    const [loadClass, setLoadClass] = useState('');

    useEffect(() => {
        getPokemon()
    },[id]);

    const getPokemon = async () => {
        const liga = 'https://pokeapi.co/api/v2/pokemon/' + id;
        axios.get(liga).then(async (response) => {
            const respuesta = response.data;
            setPokemon(respuesta);
            if (respuesta.sprites.other.dream_world.front_default !== null) {
                setImagen(respuesta.sprites.other.dream_world.front_default);
            } else {
                setImagen(respuesta.sprites.other['official-artwork'].front_default);
            }
            await getTipos(respuesta.types);
            await getHabilidades(respuesta.abilities);
            await getEstadisticas(respuesta.stats);
            await getEspecie(respuesta.species.name);
            setCardClass('');
            setLoadClass('d-none');
        });
    };

    const getEstadisticas = async (es) => {
        const listaEs = [];
        for (const h of es) {
            const response = await axios.get(h.stat.url);
            listaEs.push({ nombre: response.data.names[5].name, valor: h.base_stat });
        }
        setEstadisticas(listaEs);
    };

    const getHabilidades = async (hab) => {
        const listaHab = [];
        for (const h of hab) {
            const response = await axios.get(h.ability.url);
            listaHab.push(response.data.names[5].name);
        }
        setHabilidades(listaHab);
    };

    const getTipos = async (tip) => {
        const listaTipos = [];
        for (const t of tip) {
            const response = await axios.get(t.type.url);
            listaTipos.push(response.data.names[5].name);
        }
        setTipos(listaTipos);
    };

    const getEspecie = async (esp) => {
        const liga = 'https://pokeapi.co/api/v2/pokemon-species/' + esp;
        axios.get(liga).then(async (response) => {
            const respuesta = response.data;
            setEspecie(respuesta);
            if (respuesta.habitat !== null) {
                await getHabitat(respuesta.habitat.url);
            }
            await getDescripcion(respuesta.flavor_text_entries);
            await getEvoluciones(respuesta.evolution_chain.url);
        });
    };

    const getEvoluciones = async (ev) => {
      axios.get(ev).then(async (response) => {
          const respuesta = response.data;
          const lista = procesaEvoluciones(respuesta.chain);
          setEvoluciones(lista);
          const apoyo = lista.split(' ');
          const list = apoyo.filter((ap) => ap !== '').map((url) => ({ url }));
          setListaEvoluciones(list);
      });
  };

  const procesaEvoluciones = (info) => {
      let res = '';
      if (info.species) {
          res += info.species.url.replace('-species', '') + ' ';
      }

      if (info.evolves_to && info.evolves_to.length > 0) {
          res += procesaEvoluciones(info.evolves_to[0]);
      }

      return res;
  };

    const getHabitat = async (hab) => {
        axios.get(hab).then(async (response) => {
            setHabitat(response.data.names[1].name);
        });
    };

    const getDescripcion = (des) => {
        let texto = '';
        for (const d of des) {
            if (d.language.name === 'es') {
                texto = d.flavor_text;
                break;
            }
        }
        setDescripcion(texto);
    };

    return (
        <Container className="bg-danger mt-3">
            <Row>
                <Col>
                    <Card className="shadow mt-3 mb-3">
                        <CardBody className="mt-3">
                            <Row>
                                <Col className="text-end">
                                    <Link to="/" className="btn btn-warning">
                                        <i className="fa-solid fa-home"></i> Inicio
                                    </Link>
                                </Col>
                            </Row>
                            <Row className={loadClass}>
                                <Col md="12">
                                    <img src="" className="w-100" alt="Pokemon"></img>
                                </Col>
                            </Row>
                            <Row className={cardClass}>
                                <Col md="6">
                                    <CardText className="h1 text-capitalize">{pokemon.name}</CardText>
                                    <CardText className="fs-3">{descripcion}</CardText>
                                    <CardText className="fs-5">
                                        Altura: <b>{pokemon.height / 10} m</b>
                                        Peso: <b>{pokemon.weight / 10} kg</b>
                                    </CardText>
                                    <CardText className="fs-5">
                                        Tipo:
                                        {tipos.map((tip, i) => (
                                            <Badge pill className="me-1" color="danger" key={i}>
                                                {tip}
                                            </Badge>
                                        ))}
                                    </CardText>
                                    <CardText className="fs-5">
                                        Habilidades:
                                        {habilidades.map((hab, i) => (
                                            <Badge pill className="me-1" color="dark" key={i}>
                                                {hab}
                                            </Badge>
                                        ))}
                                    </CardText>
                                    <CardText className="fs-5 text-capitalize">
                                        Habitat: <b>{habitat}</b>
                                    </CardText>
                                </Col>
                                <Col md="6">
                                    <img src={imagen} className="img-fluid" alt="Pokemon"></img>
                                </Col>
                                <Col md="12 mt-3">
                                    <CardText className="fs-4 text-center">
                                        <b>Estadisiticas</b>
                                    </CardText>
                                </Col>
                                {estadisticas.map((es, i) => (
                                    <Row key={i}>
                                        <Col xs="6" md="3">
                                            <b>{es.nombre}</b>
                                        </Col>
                                        <Col xs="6" md="9">
                                            <Progress className="my-2" value={es.valor}>{es.valor}</Progress>
                                        </Col>
                                    </Row>
                                ))}
                                <Col md="12 mt-3">
                                    <CardText className="fs-4 text-center">
                                        <b>Cadena de Evolucion </b>
                                    </CardText>
                                </Col>
                                {listaEvoluciones.map((pok, i) => (
                                    <PokeTarjeta poke={pok} key={i} />
                                ))}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Detalle;
