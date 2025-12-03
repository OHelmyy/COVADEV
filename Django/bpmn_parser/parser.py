import xml.etree.ElementTree as ET

# BPMN XML tags vary based on namespace → we normalize them
def strip_namespace(tag):
    if '}' in tag:
        return tag.split('}', 1)[1]
    return tag

# This is the new function signature
def parse_bpmn_from_content(xml_content_string):
    # Use ElementTree.fromstring to parse XML directly from a string
    root = ET.fromstring(xml_content_string) 

    tasks = []
    events = []
    gateways = []
    flows = []

    for element in root.iter():
        tag = strip_namespace(element.tag).lower()

        # ---- Tasks ---- (and the rest of your original logic...)
        if tag in ["task", "userTask", "serviceTask", "scriptTask", "businessRuleTask", "manualTask", "sendTask"]:
            tasks.append({
                "id": element.attrib.get("id"),
                "name": element.attrib.get("name", "Unnamed Task")
            })

        # ... (Include all the other elif blocks for events, gateways, and flows) ...
        elif tag in ["startEvent", "endEvent", "intermediateThrowEvent", "intermediateCatchEvent"]:
            events.append({
                "id": element.attrib.get("id"),
                "name": element.attrib.get("name", "Unnamed Event")
            })
        
        elif tag in ["exclusiveGateway", "parallelGateway", "inclusiveGateway", "eventBasedGateway"]:
            gateways.append({
                "id": element.attrib.get("id"),
                "name": element.attrib.get("name", tag)
            })

        elif tag == "sequenceFlow":
            flows.append({
                "id": element.attrib.get("id"),
                "source": element.attrib.get("sourceRef"),
                "target": element.attrib.get("targetRef")
            })


    return {
        "tasks": tasks,
        "events": events,
        "gateways": gateways,
        "flows": flows
    }