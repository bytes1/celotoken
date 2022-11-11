import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCelo } from "@celo/react-celo";

import {
  ContractFields,
  ContractFuncTypeTag,
} from "@/components/contract-components";

//Sub Components Import
import Box from "@mui/material/Box";

export function ContractLayout({ contractName, contractData }) {
  const [viewFunctions, setViewFunctions] = useState([]);
  const [stateFunctions, setStateFunctions] = useState([]);
  const [contractFunctions, setContractFunctions] = useState([]);
  const { kit, network } = useCelo();
  const [contract, setContract] = useState({});
  const [value, setValue] = useState("");
  function handle() {
    contractData.address = value;
    alert("setting token contract to:", value);
    setValue(value);
  }
  console.log("data", contractData.address);
  useEffect(() => {
    const abi = contractData.abi;
    if (abi) {
      setViewFunctions(
        abi.filter(
          (contract) =>
            contract.type === "function" && contract.stateMutability === "view"
        )
      );

      setStateFunctions(
        abi.filter(
          (contract) =>
            contract.type === "function" &&
            ["nonpayable", "payable"].includes(contract.stateMutability)
        )
      );

      setContractFunctions([...viewFunctions, ...stateFunctions]);

      try {
        const contract = new kit.connection.web3.eth.Contract(
          contractData.abi,
          contractData.address
        );

        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    }
  }, [contractData]);

  return (
    <div>
      {contractData.address != "" && value != "ox" ? (
        <div>
          <h4>
            deployed at{" "}
            <a
              target="_blank"
              href={`${network.explorer}/address/${contractData.address}`}
            >
              {contractData.address}
            </a>
          </h4>
          <div>
            {viewFunctions.map(
              ({ inputs, name, outputs, stateMutability }, key) => {
                return (
                  <Accordion key={key}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={"panel" + key + "-content"}
                      id={"panel" + key + "-header"}
                    >
                      <Typography mr={1}>{name}</Typography>
                      <ContractFuncTypeTag funcType={stateMutability} />
                    </AccordionSummary>
                    <AccordionDetails>
                      <ContractFields
                        funcName={name}
                        inputs={inputs}
                        outputs={outputs}
                        contract={contract}
                        stateMutability={stateMutability}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              }
            )}
            {stateFunctions.map(
              ({ inputs, name, outputs, stateMutability }, key) => {
                return (
                  <Accordion key={key}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={"panel" + key + "-content"}
                      id={"panel" + key + "-header"}
                    >
                      <Typography mr={1}>{name}</Typography>
                      <ContractFuncTypeTag funcType={stateMutability} />
                    </AccordionSummary>
                    <AccordionDetails>
                      <ContractFields
                        funcName={name}
                        inputs={inputs}
                        outputs={outputs}
                        contract={contract}
                        stateMutability={stateMutability}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              }
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1>Enter the token Address to mint</h1>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button onClick={handle}>submit</button>
          <h4>{value}</h4>
        </div>
      )}
    </div>
  );
}
