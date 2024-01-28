import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap"
import axios from "axios"
import { useState, useEffect } from "react"
import PokeTarjeta from "../Components/PokeTarjeta"
import { PaginationControl } from "react-bootstrap-pagination-control"


const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [allPokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPokemones(offset)
    getAllPokemones()
  }, []);

  const getPokemones = async (o) => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=` + limit + `&offset=` + o;
    axios.get(liga).then(async (response) => {
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count)
    })
  }
  const getAllPokemones = async () => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    axios.get(liga).then(async (response) => {
      const respuesta = response.data;
      setAllPokemones(respuesta.results);
    })
  }

  const buscar = async (e) => {
    if (e.keyCode == 13) {
      if (filtro.trim() != '') {
        setListado([]);
        setTimeout(() => {
          setListado(allPokemones.filter((p) => p.name.includes(filtro)));
        }, 100)
      }
    } else if (filtro.trim() == '') {
      setListado([]);
      setTimeout(() => {
        setListado(pokemones);
      }, 100)
    }
  }

  const goPage = async(p) => {
    setListado([]);
    await getPokemones((p==1) ? 0 : ((p-1)*20) );
    setOffset(p);
  }


  return (
    <Container className="shadow bg-danger mt-3">
      <Row>
        <Col>
          <InputGroup className="my-3 shadow">
            <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText>
            <Input value={filtro} onChange={(e) => { setFiltro(e.target.value) }}
              onKeyUpCapture={buscar} placeholder="Buscar Pokemon"></Input>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-3">
      <PaginationControl  last={true} limit={limit} total={total} page={offset} changePage={page => goPage(page)}/>
        {listado.map((pok, i) => (
          <PokeTarjeta poke={pok} key={i} />
        ))}
        <PaginationControl last={true} limit={limit} total={total} page={offset} changePage={page => goPage(page)}/>
      </Row>
    </Container>
  )
}

export default Index